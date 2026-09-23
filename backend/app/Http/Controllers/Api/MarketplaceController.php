<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MarketplacePart;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $data['id'] = $this->uniqueSlug($data['category'], $data['name']);

        $part = MarketplacePart::create($data);

        return response()->json($this->partPayload($part), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $part = MarketplacePart::find($id);
        if (! $part) {
            return response()->json(['message' => 'Autoparte no encontrada.'], 404);
        }

        $part->update($this->validated($request, $id));

        return response()->json($this->partPayload($part->fresh()));
    }

    public function destroy(string $id): JsonResponse
    {
        $part = MarketplacePart::find($id);
        if (! $part) {
            return response()->json(['message' => 'Autoparte no encontrada.'], 404);
        }

        $part->delete();

        return response()->json(null, 204);
    }

    /** Reglas espejo de `NewMarketplacePart` (MarketplacePartFormModal → toMarketplacePartPayload). */
    private function validated(Request $request, ?string $ignoreId = null): array
    {
        return $request->validate([
            'sku' => [
                'required', 'string', 'max:60',
                'unique:marketplace_parts,sku' . ($ignoreId ? ",{$ignoreId},id" : ''),
            ],
            'name' => ['required', 'string', 'max:255'],
            // Sin whitelist `in:`: el admin puede agregar categoría/condición nuevas
            // desde el "+ Agregar opción" del formulario (ver SelectWithAdd,
            // resolveCategoryIcon/Label con respaldo genérico para valores custom) —
            // mismo criterio que `body_type`/`fuel_type`/`condition` en CatalogController.
            'category' => ['required', 'string', 'max:100'],
            'brand' => ['required', 'string', 'max:255'],
            'condition' => ['required', 'string', 'max:100'],
            'price' => ['required', 'integer', 'min:1'],
            'discount_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'stock' => ['required', 'integer', 'min:0'],
            'reorder_level' => ['required', 'integer', 'min:0'],
            // Data URL (base64) o URL pública — sin límite de longitud fijo.
            'image_url' => ['nullable', 'string'],
            'rating' => ['required', 'numeric', 'min:0', 'max:5'],
            'reviews' => ['required', 'integer', 'min:0'],
            'seller' => ['required', 'string', 'max:255'],
            'free_shipping' => ['boolean'],
            'warranty_months' => ['required', 'integer', 'min:0', 'max:120'],
            'compatible_brands' => ['array'],
            'compatible_brands.*' => ['string', 'max:100'],
            'year_from' => ['required', 'integer', 'min:1980', 'max:' . (now()->year + 1)],
            'year_to' => ['required', 'integer', 'min:1980', 'max:' . (now()->year + 1), 'gte:year_from'],
            'specs' => ['array'],
            'specs.*.label' => ['required_with:specs', 'string', 'max:100'],
            'specs.*.value' => ['required_with:specs', 'string', 'max:255'],
            'accent_from' => ['required', 'string', 'max:20'],
            'accent_to' => ['required', 'string', 'max:20'],
        ]);
    }

    /** Slug legible (categoría-nombre); si ya existe, le agrega un sufijo. */
    private function uniqueSlug(string $category, string $name): string
    {
        $base = Str::slug("{$category}-{$name}");
        $slug = $base;
        $suffix = 1;
        while (MarketplacePart::whereKey($slug)->exists()) {
            $slug = "{$base}-" . ++$suffix;
        }

        return $slug;
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
            'discount_percent' => $p->discount_percent,
            'stock' => $p->stock,
            'reorder_level' => $p->reorder_level,
            'image_url' => $p->image_url,
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
