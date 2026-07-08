<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MarketplacePart;
use Illuminate\Http\JsonResponse;

class MarketplaceController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            MarketplacePart::query()->orderBy('category')->get()
                ->map(fn ($p) => $this->partPayload($p))
        );
    }

    public function show(string $id): JsonResponse
    {
        $part = MarketplacePart::find($id);
        if (! $part) {
            return response()->json(null);
        }

        return response()->json($this->partPayload($part));
    }

    private function partPayload(MarketplacePart $p): array
    {
        return [
            'id' => $p->id,
            'sku' => $p->sku,
            'name' => $p->name,
            'category' => $p->category,
            'brand' => $p->brand,
            'condition' => $p->condition,
            'price' => $p->price,
            'original_price' => $p->original_price,
            'stock' => $p->stock,
            'rating' => $p->rating,
            'reviews' => $p->reviews,
            'seller' => $p->seller,
            'free_shipping' => $p->free_shipping,
            'warranty_months' => $p->warranty_months,
            'compatible_brands' => $p->compatible_brands,
            'year_from' => $p->year_from,
            'year_to' => $p->year_to,
            'specs' => $p->specs,
            'accent_from' => $p->accent_from,
            'accent_to' => $p->accent_to,
        ];
    }
}