<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'sku', 'name', 'category', 'stock', 'price',
        'reorder_level', 'units_sold',
    ];
}