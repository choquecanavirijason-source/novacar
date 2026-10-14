<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\MarketplacePart;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Espejo de `MarketplacePartDTO`.
 *
 * @mixin MarketplacePart
 */
class MarketplacePartResource extends JsonResource
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
            'category' => $this->category->value,
            'brand' => $this->brand,
            'condition' => $this->condition->value,

            'price' => $this->price,
            'discount_percent' => $this->discount_percent,
            'stock' => $this->stock,
            'reorder_level' => $this->reorder_level,

            'image_url' => $this->image_url,
            'rating' => $this->rating,
            'reviews' => $this->reviews,
            'seller' => $this->seller,

            'free_shipping' => $this->free_shipping,
            'warranty_months' => $this->warranty_months,

            'compatible_brands' => $this->compatible_brands ?? [],
            'year_from' => $this->year_from,
            'year_to' => $this->year_to,
            'specs' => $this->specs ?? [],

            'accent_from' => $this->accent_from,
            'accent_to' => $this->accent_to,

            // Derivados calculados en el modelo: el cliente no repite la fórmula.
            'final_price' => $this->final_price,
            'is_low_stock' => $this->is_low_stock,
        ];
    }
}
