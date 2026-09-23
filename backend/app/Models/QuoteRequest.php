<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteRequest extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'source', 'customer_email', 'subject', 'details', 'amount', 'status',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'integer',
        ];
    }
}
