<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatalogVehicle extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'brand', 'model', 'year', 'price', 'tagline',
        'body_type', 'fuel_type', 'transmission', 'condition',
        'mileage_km', 'horsepower', 'seats', 'features',
        'accent_from', 'accent_to', 'highlighted',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'highlighted' => 'boolean',
        ];
    }
}