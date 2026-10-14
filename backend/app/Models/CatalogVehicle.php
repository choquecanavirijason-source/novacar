<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\BodyType;
use App\Enums\DamageSeverity;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\VehicleCondition;
use Database\Factories\CatalogVehicleFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Vehículo publicado en el catálogo.
 *
 * La clave primaria es un slug legible (`nissan-versa-2021`) porque el frontend
 * la usa como URL pública (`/catalogo/{id}`); la genera CatalogVehicleService.
 *
 * @property string $id
 * @property string $brand
 * @property string $model
 * @property int $year
 * @property int $price
 * @property BodyType $body_type
 * @property FuelType $fuel_type
 * @property TransmissionType $transmission
 * @property VehicleCondition $condition
 * @property DamageSeverity $damage_severity
 * @property list<string> $features
 * @property list<string> $highlights
 * @property bool $highlighted
 */
class CatalogVehicle extends Model
{
    /** @use HasFactory<CatalogVehicleFactory> */
    use HasFactory;

    use SoftDeletes;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * Se listan explícitamente: el `id` lo asigna el servicio, nunca el request.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id', 'brand', 'model', 'year', 'price', 'tagline',
        'body_type', 'fuel_type', 'transmission', 'condition',
        'mileage_km', 'horsepower', 'seats', 'features', 'image_url',
        'accent_from', 'accent_to', 'highlighted',
        'color', 'doors', 'cylinders', 'displacement', 'drive_type',
        'title_code', 'sale_date', 'sale_time', 'sale_location',
        'has_keys', 'run_and_drive',
        'damage_type', 'damage_severity', 'damage_description', 'notes', 'highlights',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'price' => 'integer',
            'mileage_km' => 'integer',
            'horsepower' => 'integer',
            'seats' => 'integer',
            'doors' => 'integer',
            'cylinders' => 'integer',
            'features' => 'array',
            'highlights' => 'array',
            'highlighted' => 'boolean',
            'has_keys' => 'boolean',
            'run_and_drive' => 'boolean',
            'sale_date' => 'date',
            'body_type' => BodyType::class,
            'fuel_type' => FuelType::class,
            'transmission' => TransmissionType::class,
            'condition' => VehicleCondition::class,
            'damage_severity' => DamageSeverity::class,
        ];
    }

    /** Solo los destacados del home. */
    public function scopeHighlighted(Builder $query): Builder
    {
        return $query->where('highlighted', true);
    }

    /** Búsqueda libre por marca, modelo o gancho comercial. */
    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if ($term === null || trim($term) === '') {
            return $query;
        }

        $needle = '%'.str_replace('%', '\%', mb_strtolower(trim($term))).'%';

        return $query->where(function (Builder $inner) use ($needle): void {
            $inner->whereRaw('LOWER(brand) LIKE ?', [$needle])
                ->orWhereRaw('LOWER(model) LIKE ?', [$needle])
                ->orWhereRaw('LOWER(tagline) LIKE ?', [$needle]);
        });
    }

    public function scopeOfBrand(Builder $query, ?string $brand): Builder
    {
        return $brand === null ? $query : $query->where('brand', $brand);
    }

    public function scopeOfBodyType(Builder $query, ?BodyType $bodyType): Builder
    {
        return $bodyType === null ? $query : $query->where('body_type', $bodyType);
    }

    public function scopeOfFuelType(Builder $query, ?FuelType $fuelType): Builder
    {
        return $fuelType === null ? $query : $query->where('fuel_type', $fuelType);
    }

    public function scopePriceUpTo(Builder $query, ?int $maxPrice): Builder
    {
        return $maxPrice === null ? $query : $query->where('price', '<=', $maxPrice);
    }

    /** Orden canónico del catálogo: destacados primero, luego alfabético. */
    public function scopeCatalogOrder(Builder $query): Builder
    {
        return $query->orderByDesc('highlighted')->orderBy('brand')->orderBy('model');
    }

    /** Etiqueta comercial completa, reutilizada por eventos y notificaciones. */
    public function fullName(): string
    {
        return trim("{$this->brand} {$this->model} {$this->year}");
    }
}
