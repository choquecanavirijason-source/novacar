<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

/**
 * Ítem del inventario operativo legado (`GET /admin/inventory`).
 *
 * Convive con MarketplacePart: aquel es el catálogo comercial, este el conteo
 * físico por SKU que consume el tablero de reposición.
 *
 * @property string $id
 * @property int $stock
 * @property int $reorder_level
 * @property-read bool $is_low_stock
 */
class InventoryItem extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    /** @var list<string> */
    protected $fillable = [
        'id', 'sku', 'name', 'category', 'stock', 'price',
        'reorder_level', 'units_sold',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'stock' => 'integer',
            'price' => 'integer',
            'reorder_level' => 'integer',
            'units_sold' => 'integer',
        ];
    }

    /**
     * @return Attribute<bool, never>
     */
    protected function isLowStock(): Attribute
    {
        return Attribute::get(fn (): bool => $this->stock <= $this->reorder_level);
    }

    public function scopeLowStock(Builder $query): Builder
    {
        return $query->whereColumn('stock', '<=', 'reorder_level');
    }

    public function scopeOfCategory(Builder $query, ?string $category): Builder
    {
        return $category === null ? $query : $query->where('category', $category);
    }

    /** Orden canónico del tablero: por categoría y nombre. */
    public function scopeCatalogOrder(Builder $query): Builder
    {
        return $query->orderBy('category')->orderBy('name');
    }
}
