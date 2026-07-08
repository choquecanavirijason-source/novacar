<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatalogVehicle;
use Illuminate\Http\JsonResponse;

class CatalogController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            CatalogVehicle::query()->orderByDesc('highlighted')->orderBy('brand')->get()
                ->map(fn ($v) => $this->vehiclePayload($v))
        );
    }

    public function show(string $id): JsonResponse
    {
        $vehicle = CatalogVehicle::find($id);
        if (! $vehicle) {
            return response()->json(['message' => 'Vehículo no encontrado.'], 404);
        }

        return response()->json($this->vehiclePayload($vehicle));
    }

    private function vehiclePayload(CatalogVehicle $v): array
    {
        return [
            'id' => $v->id,
            'brand' => $v->brand,
            'model' => $v->model,
            'year' => $v->year,
            'price' => $v->price,
            'tagline' => $v->tagline,
            'body_type' => $v->body_type,
            'fuel_type' => $v->fuel_type,
            'transmission' => $v->transmission,
            'condition' => $v->condition,
            'mileage_km' => $v->mileage_km,
            'horsepower' => $v->horsepower,
            'seats' => $v->seats,
            'features' => $v->features,
            'accent_from' => $v->accent_from,
            'accent_to' => $v->accent_to,
            'highlighted' => $v->highlighted,
        ];
    }
}