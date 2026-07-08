<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarketplacePart extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'sku', 'name', 'category', 'brand', 'condition', 'price',
        'original_price', 'stock', 'rating', 'reviews', 'seller',
        'free_shipping', 'warranty_months', 'compatible_brands',
        'year_from', 'year_to', 'specs', 'accent_from', 'accent_to',
    ];

    protected function casts(): array
    {
        return [
            'compatible_brands' => 'array',
            'specs' => 'array',
            'free_shipping' => 'boolean',
            'rating' => 'float',
        ];
    }
}