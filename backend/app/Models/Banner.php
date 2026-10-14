<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\BannerFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Banner promocional del home.
 *
 * @property string $id
 * @property bool $active
 * @property int $sort_order
 */
class Banner extends Model
{
    /** @use HasFactory<BannerFactory> */
    use HasFactory;

    use HasUlids;
    use SoftDeletes;

    /** @var list<string> */
    protected $fillable = [
        'title', 'subtitle', 'image_url', 'cta_label', 'href',
        'accent_from', 'accent_to', 'active', 'sort_order', 'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /** Operador que dio de alta el banner (nullable: puede haberse borrado). */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('active', true);
    }

    /** Orden manual definido por las flechas de la tabla del panel. */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('created_at');
    }
}
