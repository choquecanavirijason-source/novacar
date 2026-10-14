<?php

declare(strict_types=1);

namespace App\Services;

use App\DataTransferObjects\CatalogVehicleData;
use App\DataTransferObjects\VehicleFilters;
use App\Events\CatalogVehiclePublished;
use App\Events\CatalogVehicleRemoved;
use App\Events\CatalogVehicleUpdated;
use App\Exceptions\BusinessRuleViolationException;
use App\Exceptions\ResourceNotFoundException;
use App\Models\CatalogVehicle;
use App\Models\VehicleFitment;
use App\Support\SlugGenerator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Reglas de negocio del catálogo de vehículos.
 *
 * Es el único lugar donde se decide cómo nace un vehículo: el identificador
 * público (slug), la normalización de la ficha técnica y la sincronización con
 * el catálogo de compatibilidad del buscador por pasos.
 *
 * Los controladores nunca tocan Eloquent y este servicio nunca toca el Request.
 */
final class CatalogVehicleService
{
    public function __construct(private readonly SlugGenerator $slugGenerator) {}

    /**
     * Listado del catálogo público, con filtros opcionales.
     *
     * @return Collection<int, CatalogVehicle>
     */
    public function list(?VehicleFilters $filters = null): Collection
    {
        $filters ??= new VehicleFilters;

        return CatalogVehicle::query()
            ->ofBrand($filters->brand)
            ->ofBodyType($filters->bodyType)
            ->ofFuelType($filters->fuelType)
            ->priceUpTo($filters->maxPrice)
            ->search($filters->search)
            ->catalogOrder()
            ->get();
    }

    /**
     * Destacados del home. El límite es una regla de presentación del negocio
     * (el hero muestra como máximo cuatro), no del componente que los pinta.
     *
     * @return Collection<int, CatalogVehicle>
     */
    public function featured(int $limit = 4): Collection
    {
        return CatalogVehicle::query()
            ->highlighted()
            ->orderByDesc('created_at')
            ->limit(max(1, $limit))
            ->get();
    }

    public function findOrFail(string $id): CatalogVehicle
    {
        $vehicle = CatalogVehicle::query()->find($id);

        if ($vehicle === null) {
            throw ResourceNotFoundException::vehicle($id);
        }

        return $vehicle;
    }

    /**
     * Facetas derivadas del dataset real, tal como las arma el frontend:
     * marcas y tipos únicos ordenados, más el rango de precios.
     *
     * @return array{brands: list<string>, body_types: list<string>, fuel_types: list<string>, price_range: array{min: int, max: int}}
     */
    public function filterOptions(): array
    {
        $aggregates = CatalogVehicle::query()
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        return [
            'brands' => CatalogVehicle::query()
                ->distinct()->orderBy('brand')->pluck('brand')->values()->all(),
            'body_types' => CatalogVehicle::query()
                ->distinct()->orderBy('body_type')->pluck('body_type')
                ->map(static fn (mixed $type): string => is_object($type) ? $type->value : (string) $type)
                ->values()->all(),
            'fuel_types' => CatalogVehicle::query()
                ->distinct()->orderBy('fuel_type')->pluck('fuel_type')
                ->map(static fn (mixed $type): string => is_object($type) ? $type->value : (string) $type)
                ->values()->all(),
            'price_range' => [
                'min' => (int) ($aggregates?->min_price ?? 0),
                'max' => (int) ($aggregates?->max_price ?? 0),
            ],
        ];
    }

    /**
     * Publica un vehículo nuevo.
     *
     * Transaccional porque son dos escrituras: el vehículo y su fitment en el
     * buscador; si la segunda falla, la primera no debe quedar suelta.
     *
     * @throws BusinessRuleViolationException
     */
    public function create(CatalogVehicleData $data): CatalogVehicle
    {
        $normalized = $this->assertBusinessRules($data)->withNormalizedSpecs();

        $vehicle = DB::transaction(function () use ($normalized): CatalogVehicle {
            $vehicle = CatalogVehicle::query()->create([
                'id' => $this->generateId($normalized),
                ...$normalized->toArray(),
            ]);

            $this->syncFitment($vehicle);

            return $vehicle;
        });

        CatalogVehiclePublished::dispatch($vehicle);

        return $vehicle;
    }

    /**
     * Actualiza un vehículo existente conservando su identificador público:
     * la URL `/catalogo/{id}` ya puede estar indexada o compartida.
     *
     * @throws ResourceNotFoundException|BusinessRuleViolationException
     */
    public function update(string $id, CatalogVehicleData $data): CatalogVehicle
    {
        $vehicle = $this->findOrFail($id);
        $normalized = $this->assertBusinessRules($data)->withNormalizedSpecs();

        $changes = DB::transaction(function () use ($vehicle, $normalized): array {
            $vehicle->fill($normalized->toArray());
            $changes = $vehicle->getDirty();
            $vehicle->save();

            $this->syncFitment($vehicle);

            return $changes;
        });

        CatalogVehicleUpdated::dispatch($vehicle, $changes);

        return $vehicle->refresh();
    }

    /**
     * Retira el vehículo del catálogo (borrado lógico: la ficha desaparece del
     * sitio pero la cotización que lo referencia conserva su histórico).
     *
     * @throws ResourceNotFoundException
     */
    public function delete(string $id): void
    {
        $vehicle = $this->findOrFail($id);
        $fullName = $vehicle->fullName();

        DB::transaction(static function () use ($vehicle): void {
            $vehicle->delete();
        });

        CatalogVehicleRemoved::dispatch($id, $fullName);
    }

    /**
     * Devuelve al catálogo un vehículo retirado.
     *
     * @throws ResourceNotFoundException
     */
    public function restore(string $id): CatalogVehicle
    {
        $vehicle = CatalogVehicle::withTrashed()->find($id);

        if ($vehicle === null) {
            throw ResourceNotFoundException::vehicle($id);
        }

        $vehicle->restore();

        return $vehicle;
    }

    /**
     * Invariantes que deben cumplirse llame quien llame (HTTP, seeder, comando).
     * La validación del FormRequest cubre el formato; esto cubre el negocio.
     *
     * @throws BusinessRuleViolationException
     */
    private function assertBusinessRules(CatalogVehicleData $data): CatalogVehicleData
    {
        if ($data->price <= 0) {
            throw new BusinessRuleViolationException(
                'El precio del vehículo debe ser mayor a cero.',
                'invalid_vehicle_price',
                ['price' => $data->price],
            );
        }

        $maxYear = (int) date('Y') + 1;

        if ($data->year < 1980 || $data->year > $maxYear) {
            throw new BusinessRuleViolationException(
                "El año debe estar entre 1980 y {$maxYear}.",
                'invalid_vehicle_year',
                ['year' => $data->year],
            );
        }

        if (! $data->condition->allowsMileage() && $data->mileageKm > 1000) {
            throw BusinessRuleViolationException::newVehicleCannotHaveMileage();
        }

        return $data;
    }

    /**
     * Identificador público estable: `marca-modelo-año`, con sufijo numérico si
     * ya existe otro vehículo con la misma combinación.
     */
    private function generateId(CatalogVehicleData $data): string
    {
        return $this->slugGenerator->generate(
            $data->slugSource(),
            static fn (string $candidate): bool => CatalogVehicle::withTrashed()
                ->whereKey($candidate)
                ->exists(),
        );
    }

    /**
     * Publicar un auto habilita automáticamente su marca/modelo/año en el
     * buscador de autopartes por pasos. Sin esto, el wizard mostraría un
     * catálogo desalineado con lo que realmente está a la venta.
     */
    private function syncFitment(CatalogVehicle $vehicle): void
    {
        VehicleFitment::query()->firstOrCreate([
            'brand' => $vehicle->brand,
            'model' => $vehicle->model,
            'year' => $vehicle->year,
        ]);
    }
}
