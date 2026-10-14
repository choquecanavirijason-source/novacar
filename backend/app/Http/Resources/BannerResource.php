<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Espejo de `BannerDTO`.
 *
 * La columna se llama `sort_order` (evita chocar con la palabra reservada
 * ORDER en SQL) pero el contrato público conserva `order`.
 *
 * @mixin Banner
 */
class BannerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'subtitle' => $this->subtitle ?? '',
            'image_url' => $this->image_url ?? '',
            'cta_label' => $this->cta_label,
            'href' => $this->href,
            'accent_from' => $this->accent_from,
            'accent_to' => $this->accent_to,
            'active' => $this->active,
            'order' => $this->sort_order,

            // Solo viaja si el controlador cargó la relación explícitamente.
            'author' => new UserResource($this->whenLoaded('author')),
        ];
    }
}
