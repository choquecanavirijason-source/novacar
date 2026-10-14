<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use App\Enums\PartCategory;
use Illuminate\Http\Request;

/**
 * Filtros del marketplace de autopartes y del inventario del panel.
 */
final readonly class PartFilters
{
    public function __construct(
        public ?PartCategory $category = null,
        public ?string $search = null,
        public bool $onlyInStock = false,
        public bool $onlyLowStock = false,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            category: PartCategory::tryFrom((string) $request->query('category', '')),
            search: self::nullableString($request->query('q')),
            onlyInStock: $request->boolean('in_stock'),
            onlyLowStock: $request->boolean('low_stock'),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'category' => $this->category?->value,
            'q' => $this->search,
            'in_stock' => $this->onlyInStock,
            'low_stock' => $this->onlyLowStock,
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
