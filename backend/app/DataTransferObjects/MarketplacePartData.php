<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use App\Enums\PartCategory;
use App\Enums\PartCondition;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Payload de alta/edición de una autoparte del marketplace.
 */
final readonly class MarketplacePartData
{
    /**
     * @param  list<string>  $compatibleBrands
     * @param  list<array{label: string, value: string}>  $specs
     */
    public function __construct(
        public string $sku,
        public string $name,
        public PartCategory $category,
        public string $brand,
        public PartCondition $condition,
        public int $price,
        public int $discountPercent,
        public int $stock,
        public int $reorderLevel,
        public ?string $imageUrl,
        public float $rating,
        public int $reviews,
        public string $seller,
        public bool $freeShipping,
        public int $warrantyMonths,
        public array $compatibleBrands,
        public int $yearFrom,
        public int $yearTo,
        public array $specs,
        public string $accentFrom,
        public string $accentTo,
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        $category = PartCategory::from((string) $data['category']);

        return new self(
            sku: strtoupper(trim((string) ($data['sku'] ?? ''))),
            name: trim((string) $data['name']),
            category: $category,
            brand: trim((string) ($data['brand'] ?? 'Genérico')),
            condition: PartCondition::from((string) $data['condition']),
            price: (int) $data['price'],
            discountPercent: (int) ($data['discount_percent'] ?? 0),
            stock: (int) ($data['stock'] ?? 0),
            reorderLevel: (int) ($data['reorder_level'] ?? 5),
            imageUrl: self::nullableString($data['image_url'] ?? null),
            rating: round((float) ($data['rating'] ?? 4.5), 1),
            reviews: (int) ($data['reviews'] ?? 0),
            seller: trim((string) ($data['seller'] ?? 'NOVACAR Oficial')),
            freeShipping: (bool) ($data['free_shipping'] ?? true),
            warrantyMonths: (int) ($data['warranty_months'] ?? 12),
            compatibleBrands: self::stringList($data['compatible_brands'] ?? []),
            yearFrom: (int) ($data['year_from'] ?? 2012),
            yearTo: (int) ($data['year_to'] ?? (int) date('Y')),
            specs: self::specList($data['specs'] ?? []),
            accentFrom: (string) ($data['accent_from'] ?? '#005f8f'),
            accentTo: (string) ($data['accent_to'] ?? '#00aaff'),
        );
    }

    /**
     * Forma exacta de las columnas de `marketplace_parts`.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'sku' => $this->sku,
            'name' => $this->name,
            'category' => $this->category,
            'brand' => $this->brand,
            'condition' => $this->condition,
            'price' => $this->price,
            'discount_percent' => $this->discountPercent,
            'stock' => $this->stock,
            'reorder_level' => $this->reorderLevel,
            'image_url' => $this->imageUrl,
            'rating' => $this->rating,
            'reviews' => $this->reviews,
            'seller' => $this->seller,
            'free_shipping' => $this->freeShipping,
            'warranty_months' => $this->warrantyMonths,
            'compatible_brands' => $this->compatibleBrands,
            'year_from' => $this->yearFrom,
            'year_to' => $this->yearTo,
            'specs' => $this->specs,
            'accent_from' => $this->accentFrom,
            'accent_to' => $this->accentTo,
        ];
    }

    /** Precio efectivo tras el descuento (misma fórmula que el frontend). */
    public function finalPrice(): int
    {
        return (int) round($this->price * (1 - $this->discountPercent / 100));
    }

    /** Semilla del slug público (`battery-bateria-lth-grupo-35`). */
    public function slugSource(): string
    {
        return "{$this->category->value} {$this->name}";
    }

    /** SKU sugerido cuando el formulario no captura uno. */
    public function generatedSku(): string
    {
        return sprintf('%s-%04d', $this->category->skuPrefix(), random_int(1000, 9999));
    }

    /**
     * @return list<string>
     */
    private static function stringList(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return array_values(array_unique(array_filter(
            array_map(static fn (mixed $item): string => trim((string) $item), $value),
            static fn (string $item): bool => $item !== '',
        )));
    }

    /**
     * Normaliza las especificaciones a pares {label, value} sin huecos.
     *
     * @return list<array{label: string, value: string}>
     */
    private static function specList(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        $specs = [];

        foreach ($value as $spec) {
            if (! is_array($spec)) {
                continue;
            }

            $label = trim((string) ($spec['label'] ?? ''));
            $specValue = trim((string) ($spec['value'] ?? ''));

            if ($label !== '' && $specValue !== '') {
                $specs[] = ['label' => $label, 'value' => $specValue];
            }
        }

        return $specs;
    }

    private static function nullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $text = trim((string) $value);

        return $text === '' ? null : $text;
    }
}
