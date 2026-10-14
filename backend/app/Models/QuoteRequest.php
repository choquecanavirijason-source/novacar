<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\QuoteSource;
use App\Enums\QuoteStatus;
use Database\Factories\QuoteRequestFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Cotización o consulta enviada desde el sitio público.
 *
 * @property string $id
 * @property QuoteSource $source
 * @property QuoteStatus $status
 * @property int|null $amount
 */
class QuoteRequest extends Model
{
    /** @use HasFactory<QuoteRequestFactory> */
    use HasFactory;

    use HasUlids;
    use SoftDeletes;

    /** @var list<string> */
    protected $fillable = [
        'source', 'customer_email', 'subject', 'details', 'amount',
        'status', 'vehicle_id', 'part_id', 'handled_by', 'handled_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'source' => QuoteSource::class,
            'status' => QuoteStatus::class,
            'amount' => 'integer',
            'handled_at' => 'datetime',
        ];
    }

    /** Operador que movió la solicitud de estado. */
    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }

    /** Vehículo de origen cuando la solicitud nació en una ficha del catálogo. */
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(CatalogVehicle::class, 'vehicle_id');
    }

    /** Autoparte de origen cuando la consulta nació en el marketplace. */
    public function part(): BelongsTo
    {
        return $this->belongsTo(MarketplacePart::class, 'part_id');
    }

    public function scopeOfStatus(Builder $query, ?QuoteStatus $status): Builder
    {
        return $status === null ? $query : $query->where('status', $status);
    }

    public function scopeOfSource(Builder $query, ?QuoteSource $source): Builder
    {
        return $source === null ? $query : $query->where('source', $source);
    }

    /** Bandeja: lo más reciente primero. */
    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('created_at');
    }

    /** Pendientes de atención (aún sin contactar). */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', QuoteStatus::New);
    }
}
