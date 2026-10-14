<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use App\Enums\BodyType;
use App\Enums\FuelType;
use Illuminate\Http\Request;

/**
 * Filtros del catálogo público (`VehicleFilters` del frontend) resueltos desde
 * la query string. Todos opcionales: la ausencia significa "sin filtrar".
 *
 * Hoy el explorador filtra en memoria; este objeto permite mover ese trabajo al
 * servidor sin tocar la firma del servicio.
 */
final readonly class VehicleFilters
{
    public function __construct(
        public ?string $brand = null,
        public ?BodyType $bodyType = null,
        public ?FuelType $fuelType = null,
        public ?int $maxPrice = null,
        public ?string $search = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $maxPrice = $request->query('max_price');

        return new self(
            brand: self::nullableString($request->query('brand')),
            bodyType: BodyType::tryFrom((string) $request->query('body_type', '')),
            fuelType: FuelType::tryFrom((string) $request->query('fuel_type', '')),
            maxPrice: $maxPrice === null ? null : max(0, (int) $maxPrice),
            search: self::nullableString($request->query('q')),
        );
    }

    public function isEmpty(): bool
    {
        return $this->brand === null
            && $this->bodyType === null
            && $this->fuelType === null
            && $this->maxPrice === null
            && $this->search === null;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'brand' => $this->brand,
            'body_type' => $this->bodyType?->value,
            'fuel_type' => $this->fuelType?->value,
            'max_price' => $this->maxPrice,
            'q' => $this->search,
        ];
    }

    private static function nullableString(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $text = trim($value);

        return $text === '' ? null : $text;
    }
}
