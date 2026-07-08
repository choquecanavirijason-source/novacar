<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompatiblePart extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'sku', 'name', 'category', 'brand', 'price', 'stock',
        'amperage', 'voltage', 'bci_group', 'fuse_type', 'color',
    ];
}