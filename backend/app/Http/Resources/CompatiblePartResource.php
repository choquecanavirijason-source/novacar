<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\CompatiblePart;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Pieza del catálogo de compatibilidad por ficha técnica.
 *
 * @mixin CompatiblePart
 */
class CompatiblePartResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'name' => $this->name,
            'category' => $this->category,
            'brand' => $this->brand,
            'price' => $this->price,
            'stock' => $this->stock,
            'amperage' => $this->amperage,
            'voltage' => $this->voltage,
            'bci_group' => $this->bci_group,
            'fuse_type' => $this->fuse_type,
            'color' => $this->color,
        ];
    }
}
