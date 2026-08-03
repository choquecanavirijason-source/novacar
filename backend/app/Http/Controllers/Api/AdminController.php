<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function inventory(): JsonResponse
    {
        return response()->json(
            InventoryItem::query()->orderBy('category')->orderBy('name')->get()
                ->map(fn ($i) => $this->itemPayload($i))
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:vehicle,battery,fuse'],
            'price' => ['required', 'integer', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'reorder_level' => ['required', 'integer', 'min:0'],
        ]);

        $prefix = ['vehicle' => 'VH', 'battery' => 'BAT', 'fuse' => 'FUS'][$data['category']];

        $item = InventoryItem::create([
            'id' => (string) Str::uuid(),
            'sku' => sprintf('%s-%04d', $prefix, random_int(1000, 9999)),
            'name' => $data['name'],
            'category' => $data['category'],
            'price' => $data['price'],
            'stock' => $data['stock'],
            'reorder_level' => $data['reorder_level'],
        ]);

        return response()->json($this->itemPayload($item), 201);
    }

    public function analytics(): JsonResponse
    {
        $items = InventoryItem::all();
        $lowStock = $items->filter(fn ($i) => $i->stock <= $i->reorder_level);

        $topSelling = $items
            ->sortByDesc('units_sold')
            ->take(3)
            ->map(fn ($i) => ['name' => $i->name, 'units' => $i->units_sold])
            ->values();

        return response()->json([
            'stats' => [
                'total_vehicles' => $items->where('category', 'vehicle')->count(),
                'total_parts' => $items->where('category', '!=', 'vehicle')->count(),
                'low_stock_count' => $lowStock->count(),
                'monthly_revenue' => 1_284_500,
            ],
            'top_selling_parts' => $topSelling,
        ]);
    }

    public function updateStock(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'stock' => ['required', 'integer', 'min:0'],
        ]);

        $item = InventoryItem::find($id);
        if (! $item) {
            return response()->json(['message' => 'Ítem no encontrado.'], 404);
        }

        $item->update(['stock' => $data['stock']]);

        return response()->json($this->itemPayload($item->fresh()));
    }

    private function itemPayload(InventoryItem $item): array
    {
        return [
            'id' => $item->id,
            'sku' => $item->sku,
            'name' => $item->name,
            'category' => $item->category,
            'stock' => $item->stock,
            'price' => $item->price,
            'reorder_level' => $item->reorder_level,
        ];
    }
}