<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Pieza del catálogo de compatibilidad por ficha técnica (baterías y fusibles)
 * que alimenta `GET /parts/compatible`.
 *
 * @property string $id
 * @property int $stock
 */
class CompatiblePart extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    /** @var list<string> */
    protected $fillable = [
        'id', 'sku', 'name', 'category', 'brand', 'price', 'stock',
        'amperage', 'voltage', 'bci_group', 'fuse_type', 'color',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'stock' => 'integer',
            'amperage' => 'integer',
            'voltage' => 'integer',
        ];
    }

    public function scopeOfCategory(Builder $query, ?string $category): Builder
    {
        return $category === null ? $query : $query->where('category', $category);
    }

    public function scopeInStock(Builder $query): Builder
    {
        return $query->where('stock', '>', 0);
    }

    /** Con stock primero y luego por precio ascendente (misma regla que el front). */
    public function scopeStorefrontOrder(Builder $query): Builder
    {
        return $query->orderByRaw('CASE WHEN stock > 0 THEN 0 ELSE 1 END')->orderBy('price');
    }
}
