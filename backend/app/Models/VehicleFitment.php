<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * Combinación marca / modelo / año que alimenta el buscador por pasos.
 *
 * CatalogVehicleService la sincroniza en cada alta de vehículo, de modo que
 * publicar un auto habilita automáticamente su marca en el wizard.
 *
 * @property string $brand
 * @property string $model
 * @property int $year
 */
class VehicleFitment extends Model
{
    /** @var list<string> */
    protected $fillable = ['brand', 'model', 'year'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['year' => 'integer'];
    }

    public function scopeOfBrand(Builder $query, string $brand): Builder
    {
        return $query->where('brand', $brand);
    }

    public function scopeOfModel(Builder $query, string $model): Builder
    {
        return $query->where('model', $model);
    }
}
