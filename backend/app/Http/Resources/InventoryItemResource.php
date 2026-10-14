<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Ítem del inventario operativo legado.
 *
 * @mixin InventoryItem
 */
class InventoryItemResource extends JsonResource
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
            'stock' => $this->stock,
            'price' => $this->price,
            'reorder_level' => $this->reorder_level,
            'units_sold' => $this->units_sold,
            'is_low_stock' => $this->is_low_stock,
        ];
    }
}
