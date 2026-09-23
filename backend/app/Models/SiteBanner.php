<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SiteBanner extends Model
{
    protected $table = 'site_banners';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'title', 'subtitle', 'image_url', 'cta_label', 'href',
        'accent_from', 'accent_to', 'active', 'sort_order',
    ];

    protected static function booted(): void
    {
        static::creating(function (SiteBanner $banner) {
            $banner->id ??= (string) Str::uuid();
        });
    }

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
