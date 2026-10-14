<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PartCategory;
use App\Enums\PartCondition;
use Database\Factories\MarketplacePartFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Autoparte del marketplace. Modelo único para la tienda pública y para el
 * inventario del panel (stock + umbral de reorden).
 *
 * @property string $id
 * @property string $sku
 * @property PartCategory $category
 * @property PartCondition $condition
 * @property int $price
 * @property int $discount_percent
 * @property int $stock
 * @property int $reorder_level
 * @property list<string> $compatible_brands
 * @property list<array{label: string, value: string}> $specs
 * @property-read int $final_price
 * @property-read bool $is_low_stock
 */
class MarketplacePart extends Model
{
    /** @use HasFactory<MarketplacePartFactory> */
    use HasFactory;

    use SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    /** @var list<string> */
    protected $fillable = [
        'id', 'sku', 'name', 'category', 'brand', 'condition',
        'price', 'discount_percent', 'stock', 'reorder_level', 'image_url',
        'rating', 'reviews', 'seller', 'free_shipping', 'warranty_months',
        'compatible_brands', 'year_from', 'year_to', 'specs',
        'accent_from', 'accent_to',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'discount_percent' => 'integer',
            'stock' => 'integer',
            'reorder_level' => 'integer',
            'reviews' => 'integer',
            'warranty_months' => 'integer',
            'year_from' => 'integer',
            'year_to' => 'integer',
            'rating' => 'float',
            'free_shipping' => 'boolean',
            'compatible_brands' => 'array',
            'specs' => 'array',
            'category' => PartCategory::class,
            'condition' => PartCondition::class,
        ];
    }

    /**
     * Precio final ya aplicado el descuento. Espeja `finalPrice()` del dominio
     * del frontend para que ambos lados calculen exactamente lo mismo.
     *
     * @return Attribute<int, never>
     */
    protected function finalPrice(): Attribute
    {
        return Attribute::get(
            fn (): int => (int) round($this->price * (1 - $this->discount_percent / 100))
        );
    }

    /**
     * Regla de negocio compartida: stock en o por debajo del umbral de reorden.
     *
     * @return Attribute<bool, never>
     */
    protected function isLowStock(): Attribute
    {
        return Attribute::get(fn (): bool => $this->stock <= $this->reorder_level);
    }

    public function scopeOfCategory(Builder $query, ?PartCategory $category): Builder
    {
        return $category === null ? $query : $query->where('category', $category);
    }

    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('stock', '>', 0);
    }

    /** Piezas que dispararon la alerta de reposición del panel. */
    public function scopeLowStock(Builder $query): Builder
    {
        return $query->whereColumn('stock', '<=', 'reorder_level');
    }

    /** Búsqueda del admin: nombre, SKU o marca. */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if ($term === null || trim($term) === '') {
            return $query;
        }

        $needle = '%'.str_replace('%', '\%', mb_strtolower(trim($term))).'%';

        return $query->where(function (Builder $inner) use ($needle): void {
            $inner->whereRaw('LOWER(name) LIKE ?', [$needle])
                ->orWhereRaw('LOWER(sku) LIKE ?', [$needle])
                ->orWhereRaw('LOWER(brand) LIKE ?', [$needle]);
        });
    }

    /**
     * Compatibilidad usada por el buscador por pasos: marca dentro de la lista
     * (o pieza universal) y año dentro del rango declarado.
     */
    public function scopeCompatibleWith(Builder $query, string $brand, int $year): Builder
    {
        return $query
            ->where('year_from', '<=', $year)
            ->where('year_to', '>=', $year)
            ->where(function (Builder $inner) use ($brand): void {
                $inner->whereJsonContains('compatible_brands', $brand)
                    ->orWhereJsonLength('compatible_brands', 0);
            });
    }
}
