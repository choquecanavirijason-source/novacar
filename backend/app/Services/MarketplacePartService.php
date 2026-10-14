<?php

declare(strict_types=1);

namespace App\Services;

use App\DataTransferObjects\MarketplacePartData;
use App\DataTransferObjects\PartFilters;
use App\Enums\PartCategory;
use App\Events\MarketplacePartStockChanged;
use App\Exceptions\BusinessRuleViolationException;
use App\Exceptions\DuplicateResourceException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\ResourceNotFoundException;
use App\Models\MarketplacePart;
use App\Support\SlugGenerator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Reglas de negocio del marketplace de autopartes y del inventario del panel.
 *
 * Concentra dos responsabilidades cercanas pero distintas: el CRUD comercial de
 * la pieza y el movimiento de stock, que es el único punto donde se toca la
 * existencia física y por eso se hace con bloqueo de fila.
 */
final class MarketplacePartService
{
    public function __construct(private readonly SlugGenerator $slugGenerator) {}

    /**
     * @return Collection<int, MarketplacePart>
     */
    public function list(?PartFilters $filters = null): Collection
    {
        $filters ??= new PartFilters;

        $query = MarketplacePart::query()
            ->ofCategory($filters->category)
            ->search($filters->search);

        if ($filters->onlyInStock) {
            $query->inStock();
        }

        if ($filters->onlyLowStock) {
            $query->lowStock();
        }

        return $query->orderBy('category')->orderBy('name')->get();
    }

    public function findOrFail(string $id): MarketplacePart
    {
        $part = MarketplacePart::query()->find($id);

        if ($part === null) {
            throw ResourceNotFoundException::part($id);
        }

        return $part;
    }

    /**
     * Piezas compatibles con un vehículo concreto.
     *
     * Espeja la regla del frontend: la marca debe estar en la lista (o la pieza
     * es universal) y el año debe caer dentro del rango; el resultado va con
     * stock primero y precio ascendente.
     *
     * @return Collection<int, MarketplacePart>
     */
    public function compatibleWith(string $brand, int $year, ?PartCategory $category = null): Collection
    {
        return MarketplacePart::query()
            ->compatibleWith($brand, $year)
            ->ofCategory($category)
            ->orderByRaw('CASE WHEN stock > 0 THEN 0 ELSE 1 END')
            ->orderBy('price')
            ->get();
    }

    /**
     * @throws BusinessRuleViolationException|DuplicateResourceException
     */
    public function create(MarketplacePartData $data): MarketplacePart
    {
        $this->assertBusinessRules($data);

        $sku = $data->sku !== '' ? $data->sku : $data->generatedSku();
        $this->assertSkuIsAvailable($sku);

        $part = DB::transaction(fn (): MarketplacePart => MarketplacePart::query()->create([
            'id' => $this->generateId($data),
            ...$data->toArray(),
            'sku' => $sku,
        ]));

        // Un alta con stock por debajo del umbral ya nace en alerta: se notifica
        // igual que cualquier otro movimiento para no perder la señal.
        MarketplacePartStockChanged::dispatch($part, 0, $part->stock, 'alta de autoparte');

        return $part;
    }

    /**
     * @throws ResourceNotFoundException|BusinessRuleViolationException|DuplicateResourceException
     */
    public function update(string $id, MarketplacePartData $data): MarketplacePart
    {
        $part = $this->findOrFail($id);
        $this->assertBusinessRules($data);

        $sku = $data->sku !== '' ? $data->sku : $part->sku;
        $this->assertSkuIsAvailable($sku, exceptId: $part->id);

        $previousStock = $part->stock;

        DB::transaction(static function () use ($part, $data, $sku): void {
            $part->fill([...$data->toArray(), 'sku' => $sku]);
            $part->save();
        });

        $part->refresh();

        if ($previousStock !== $part->stock) {
            MarketplacePartStockChanged::dispatch($part, $previousStock, $part->stock, 'edición de autoparte');
        }

        return $part;
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function delete(string $id): void
    {
        $part = $this->findOrFail($id);

        DB::transaction(static function () use ($part): void {
            $part->delete();
        });
    }

    /**
     * Fija el stock a un valor absoluto (conteo físico / corrección).
     *
     * @throws ResourceNotFoundException|BusinessRuleViolationException
     */
    public function setStock(string $id, int $stock, ?string $reason = null): MarketplacePart
    {
        if ($stock < 0) {
            throw new BusinessRuleViolationException(
                'El stock no puede quedar en negativo.',
                'negative_stock',
                ['stock' => $stock],
            );
        }

        return $this->mutateStock($id, static fn (int $current): int => $stock, $reason ?? 'conteo manual');
    }

    /**
     * Aplica un delta (entrada positiva, salida negativa) sobre el stock actual.
     *
     * @throws ResourceNotFoundException|InsufficientStockException
     */
    public function adjustStock(string $id, int $delta, ?string $reason = null): MarketplacePart
    {
        return $this->mutateStock(
            $id,
            static function (int $current) use ($delta, $id): int {
                $next = $current + $delta;

                if ($next < 0) {
                    throw new InsufficientStockException($id, $current, abs($delta));
                }

                return $next;
            },
            $reason ?? 'ajuste manual',
        );
    }

    /**
     * Punto único de escritura del stock.
     *
     * Usa `lockForUpdate()` dentro de la transacción para que dos ajustes
     * simultáneos no se pisen (lectura sucia clásica del inventario).
     *
     * @param  callable(int): int  $resolveStock
     *
     * @throws ResourceNotFoundException
     */
    private function mutateStock(string $id, callable $resolveStock, string $reason): MarketplacePart
    {
        [$part, $previousStock] = DB::transaction(function () use ($id, $resolveStock): array {
            $part = MarketplacePart::query()->lockForUpdate()->find($id);

            if ($part === null) {
                throw ResourceNotFoundException::part($id);
            }

            $previousStock = $part->stock;
            $part->stock = $resolveStock($previousStock);
            $part->save();

            return [$part, $previousStock];
        });

        if ($previousStock !== $part->stock) {
            MarketplacePartStockChanged::dispatch($part, $previousStock, $part->stock, $reason);
        }

        return $part;
    }

    /**
     * @throws BusinessRuleViolationException
     */
    private function assertBusinessRules(MarketplacePartData $data): void
    {
        if ($data->price <= 0) {
            throw new BusinessRuleViolationException(
                'El precio de la autoparte debe ser mayor a cero.',
                'invalid_part_price',
                ['price' => $data->price],
            );
        }

        if ($data->yearFrom > $data->yearTo) {
            throw BusinessRuleViolationException::invalidYearRange($data->yearFrom, $data->yearTo);
        }

        $maxWarranty = $data->condition->maxWarrantyMonths();

        if ($data->warrantyMonths > $maxWarranty) {
            throw BusinessRuleViolationException::warrantyExceedsConditionLimit(
                $data->condition->label(),
                $maxWarranty,
            );
        }
    }

    /**
     * @throws DuplicateResourceException
     */
    private function assertSkuIsAvailable(string $sku, ?string $exceptId = null): void
    {
        $exists = MarketplacePart::withTrashed()
            ->where('sku', $sku)
            ->when($exceptId !== null, static fn ($query) => $query->whereKeyNot($exceptId))
            ->exists();

        if ($exists) {
            throw DuplicateResourceException::sku($sku);
        }
    }

    private function generateId(MarketplacePartData $data): string
    {
        return $this->slugGenerator->generate(
            $data->slugSource(),
            static fn (string $candidate): bool => MarketplacePart::withTrashed()
                ->whereKey($candidate)
                ->exists(),
        );
    }
}
