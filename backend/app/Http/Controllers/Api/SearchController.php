<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CompatiblePart;
use App\Models\VehicleFitment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function brands(): JsonResponse
    {
        $brands = VehicleFitment::query()
            ->select('brand')
            ->distinct()
            ->orderBy('brand')
            ->pluck('brand');

        return response()->json($brands);
    }

    public function models(Request $request): JsonResponse
    {
        $brand = $request->query('brand');
        if (! $brand) {
            return response()->json([], 400);
        }

        $models = VehicleFitment::query()
            ->where('brand', $brand)
            ->select('model')
            ->distinct()
            ->orderBy('model')
            ->pluck('model');

        return response()->json($models);
    }

    public function years(Request $request): JsonResponse
    {
        $brand = $request->query('brand');
        $model = $request->query('model');
        if (! $brand || ! $model) {
            return response()->json([], 400);
        }

        $years = VehicleFitment::query()
            ->where('brand', $brand)
            ->where('model', $model)
            ->select('year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year');

        return response()->json($years);
    }

    public function compatibleParts(Request $request): JsonResponse
    {
        $query = CompatiblePart::query();
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        return response()->json($query->get()->map(fn ($p) => $this->partPayload($p)));
    }

    private function partPayload(CompatiblePart $part): array
    {
        return [
            'id' => $part->id,
            'sku' => $part->sku,
            'name' => $part->name,
            'category' => $part->category,
            'brand' => $part->brand,
            'price' => $part->price,
            'stock' => $part->stock,
            'amperage' => $part->amperage,
            'voltage' => $part->voltage,
            'bci_group' => $part->bci_group,
            'fuse_type' => $part->fuse_type,
            'color' => $part->color,
        ];
    }
}