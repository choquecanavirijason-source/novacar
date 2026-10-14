<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\CatalogVehicle;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Contrato JSON del vehículo: es el espejo exacto de `CatalogVehicleDTO` del
 * frontend, incluido el snake_case y el orden de los campos.
 *
 * @mixin CatalogVehicle
 */
class CatalogVehicleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'brand' => $this->brand,
            'model' => $this->model,
            'year' => $this->year,
            'price' => $this->price,
            'tagline' => $this->tagline,

            'body_type' => $this->body_type->value,
            'fuel_type' => $this->fuel_type->value,
            'transmission' => $this->transmission->value,
            'condition' => $this->condition->value,

            'mileage_km' => $this->mileage_km,
            'horsepower' => $this->horsepower,
            'seats' => $this->seats,
            'features' => $this->features ?? [],

            // El frontend trata `image_url` como opcional: si no hay foto
            // cargada, resuelve un placeholder por marca.
            'image_url' => $this->image_url,
            'accent_from' => $this->accent_from,
            'accent_to' => $this->accent_to,
            'highlighted' => $this->highlighted,

            'color' => $this->color,
            'doors' => $this->doors,
            'cylinders' => $this->cylinders,
            'displacement' => $this->displacement,
            'drive_type' => $this->drive_type,

            'title_code' => $this->title_code,
            'sale_date' => $this->sale_date?->format('Y-m-d') ?? '',
            'sale_time' => $this->sale_time,
            'sale_location' => $this->sale_location,
            'has_keys' => $this->has_keys,
            'run_and_drive' => $this->run_and_drive,

            'damage_type' => $this->damage_type,
            'damage_severity' => $this->damage_severity->value,
            'damage_description' => $this->damage_description ?? '',
            'notes' => $this->notes ?? '',
            'highlights' => $this->highlights ?? [],

            // Metadatos de auditoría: solo para el panel, no los pide el sitio.
            'created_at' => $this->whenNotNull($this->created_at?->toIso8601String()),
            'updated_at' => $this->whenNotNull($this->updated_at?->toIso8601String()),
        ];
    }
}
