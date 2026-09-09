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
        'mileage_km', 'horsepower', 'seats', 'top_speed_kmh', 'zero_to_hundred_sec',
        'availability', 'features',
        'image_url', 'accent_from', 'accent_to', 'highlighted',
        'color', 'doors', 'cylinders', 'displacement', 'drive_type',
        'title_code', 'sale_date', 'sale_time', 'sale_location',
        'has_keys', 'damage_type', 'damage_severity', 'damage_description',
        'notes', 'run_and_drive', 'highlights',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'highlights' => 'array',
            'highlighted' => 'boolean',
            'has_keys' => 'boolean',
            'run_and_drive' => 'boolean',
            'zero_to_hundred_sec' => 'float',
        ];
    }
}
