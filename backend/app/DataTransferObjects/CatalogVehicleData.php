<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use App\Enums\BodyType;
use App\Enums\DamageSeverity;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\VehicleCondition;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Contrato inmutable entre la capa HTTP y CatalogVehicleService.
 *
 * El servicio nunca ve un Request: recibe este objeto ya tipado (enums en vez
 * de strings sueltos), lo que permite invocarlo igual desde un comando de
 * consola, un job o un test sin montar una petición falsa.
 */
final readonly class CatalogVehicleData
{
    /**
     * @param  list<string>  $features
     * @param  list<string>  $highlights
     */
    public function __construct(
        public string $brand,
        public string $model,
        public int $year,
        public int $price,
        public string $tagline,
        public BodyType $bodyType,
        public FuelType $fuelType,
        public TransmissionType $transmission,
        public VehicleCondition $condition,
        public int $mileageKm,
        public int $horsepower,
        public int $seats,
        public array $features,
        public ?string $imageUrl,
        public string $accentFrom,
        public string $accentTo,
        public bool $highlighted,
        public string $color,
        public int $doors,
        public int $cylinders,
        public string $displacement,
        public string $driveType,
        public string $titleCode,
        public ?string $saleDate,
        public string $saleTime,
        public string $saleLocation,
        public bool $hasKeys,
        public bool $runAndDrive,
        public string $damageType,
        public DamageSeverity $damageSeverity,
        public string $damageDescription,
        public string $notes,
        public array $highlights,
    ) {}

    /**
     * Construye el DTO a partir de un Store/UpdateCatalogVehicleRequest ya validado.
     */
    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    /**
     * Punto de entrada puro (tests, seeders, comandos artisan).
     *
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            brand: trim((string) $data['brand']),
            model: trim((string) $data['model']),
            year: (int) $data['year'],
            price: (int) $data['price'],
            tagline: trim((string) ($data['tagline'] ?? '')),
            bodyType: BodyType::from((string) $data['body_type']),
            fuelType: FuelType::from((string) $data['fuel_type']),
            transmission: TransmissionType::from((string) $data['transmission']),
            condition: VehicleCondition::from((string) $data['condition']),
            mileageKm: (int) ($data['mileage_km'] ?? 0),
            horsepower: (int) ($data['horsepower'] ?? 0),
            seats: (int) ($data['seats'] ?? 5),
            features: self::stringList($data['features'] ?? []),
            imageUrl: self::nullableString($data['image_url'] ?? null),
            accentFrom: (string) ($data['accent_from'] ?? '#005f8f'),
            accentTo: (string) ($data['accent_to'] ?? '#00aaff'),
            highlighted: (bool) ($data['highlighted'] ?? false),
            color: self::textOr($data['color'] ?? null, 'No especificado'),
            doors: (int) ($data['doors'] ?? 4),
            cylinders: (int) ($data['cylinders'] ?? 4),
            displacement: self::textOr($data['displacement'] ?? null, 'No especificado'),
            driveType: self::textOr($data['drive_type'] ?? null, 'No especificado'),
            titleCode: self::textOr($data['title_code'] ?? null, 'No especificado'),
            saleDate: self::nullableString($data['sale_date'] ?? null),
            saleTime: self::textOr($data['sale_time'] ?? null, 'No especificado'),
            saleLocation: self::textOr($data['sale_location'] ?? null, 'No especificado'),
            hasKeys: (bool) ($data['has_keys'] ?? true),
            runAndDrive: (bool) ($data['run_and_drive'] ?? true),
            damageType: self::textOr($data['damage_type'] ?? null, 'Sin daños reportados'),
            damageSeverity: DamageSeverity::from((string) ($data['damage_severity'] ?? DamageSeverity::None->value)),
            damageDescription: trim((string) ($data['damage_description'] ?? '')),
            notes: trim((string) ($data['notes'] ?? '')),
            highlights: self::stringList($data['highlights'] ?? []),
        );
    }

    /**
     * Forma exacta de las columnas de `catalog_vehicles`.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'brand' => $this->brand,
            'model' => $this->model,
            'year' => $this->year,
            'price' => $this->price,
            'tagline' => $this->tagline,
            'body_type' => $this->bodyType,
            'fuel_type' => $this->fuelType,
            'transmission' => $this->transmission,
            'condition' => $this->condition,
            'mileage_km' => $this->mileageKm,
            'horsepower' => $this->horsepower,
            'seats' => $this->seats,
            'features' => $this->features,
            'image_url' => $this->imageUrl,
            'accent_from' => $this->accentFrom,
            'accent_to' => $this->accentTo,
            'highlighted' => $this->highlighted,
            'color' => $this->color,
            'doors' => $this->doors,
            'cylinders' => $this->cylinders,
            'displacement' => $this->displacement,
            'drive_type' => $this->driveType,
            'title_code' => $this->titleCode,
            'sale_date' => $this->saleDate,
            'sale_time' => $this->saleTime,
            'sale_location' => $this->saleLocation,
            'has_keys' => $this->hasKeys,
            'run_and_drive' => $this->runAndDrive,
            'damage_type' => $this->damageType,
            'damage_severity' => $this->damageSeverity,
            'damage_description' => $this->damageDescription,
            'notes' => $this->notes,
            'highlights' => $this->highlights,
        ];
    }

    /**
     * Devuelve una copia con los campos normalizados por reglas de negocio.
     * Al ser `readonly`, la única forma de "modificar" el DTO es clonarlo.
     */
    public function withNormalizedSpecs(): self
    {
        return new self(
            ...[
                ...get_object_vars($this),
                'mileageKm' => $this->condition->allowsMileage() ? $this->mileageKm : 0,
                'doors' => $this->bodyType->hasDoors() ? $this->doors : 0,
                'cylinders' => $this->fuelType->hasCylinders() ? $this->cylinders : 0,
            ],
        );
    }

    /**
     * Semilla del slug público (`nissan-versa-sense-2021`).
     */
    public function slugSource(): string
    {
        return "{$this->brand} {$this->model} {$this->year}";
    }

    /**
     * @param  mixed  $value
     * @return list<string>
     */
    private static function stringList(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return array_values(array_filter(
            array_map(static fn (mixed $item): string => trim((string) $item), $value),
            static fn (string $item): bool => $item !== '',
        ));
    }

    private static function nullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $text = trim((string) $value);

        return $text === '' ? null : $text;
    }

    private static function textOr(mixed $value, string $fallback): string
    {
        return self::nullableString($value) ?? $fallback;
    }
}
