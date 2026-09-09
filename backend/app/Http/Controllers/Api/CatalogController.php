<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatalogVehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $data['id'] = $this->uniqueSlug($data['brand'], $data['model'], $data['year']);

        $vehicle = CatalogVehicle::create($data);

        return response()->json($this->vehiclePayload($vehicle), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $vehicle = CatalogVehicle::find($id);
        if (! $vehicle) {
            return response()->json(['message' => 'Vehículo no encontrado.'], 404);
        }

        $vehicle->update($this->validated($request));

        return response()->json($this->vehiclePayload($vehicle->fresh()));
    }

    public function destroy(string $id): JsonResponse
    {
        $vehicle = CatalogVehicle::find($id);
        if (! $vehicle) {
            return response()->json(['message' => 'Vehículo no encontrado.'], 404);
        }

        $vehicle->delete();

        return response()->json(null, 204);
    }

    /** Reglas espejo de `NewCatalogVehicle` (VehicleFormModal → toCatalogVehiclePayload). */
    private function validated(Request $request): array
    {
        return $request->validate([
            'brand' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'year' => ['required', 'integer', 'min:1980', 'max:' . (now()->year + 1)],
            'price' => ['required', 'integer', 'min:1'],
            'tagline' => ['nullable', 'string', 'max:500'],
            'body_type' => ['required', 'string', 'max:100'],
            'fuel_type' => ['required', 'string', 'max:100'],
            'transmission' => ['required', 'string', 'max:100'],
            'condition' => ['required', 'string', 'max:100'],
            'mileage_km' => ['required', 'integer', 'min:0'],
            'horsepower' => ['required', 'integer', 'min:0'],
            'seats' => ['required', 'integer', 'min:1', 'max:20'],
            'top_speed_kmh' => ['nullable', 'integer', 'min:0'],
            'zero_to_hundred_sec' => ['nullable', 'numeric', 'min:0'],
            'availability' => ['nullable', 'string', 'max:100'],
            'features' => ['array'],
            'features.*' => ['string'],
            // Data URL (base64) de ImageUrlField — sin límite de longitud.
            'image_url' => ['nullable', 'string'],
            'accent_from' => ['required', 'string', 'max:20'],
            'accent_to' => ['required', 'string', 'max:20'],
            'highlighted' => ['boolean'],
            'color' => ['nullable', 'string', 'max:255'],
            'doors' => ['nullable', 'integer', 'min:0', 'max:10'],
            'cylinders' => ['nullable', 'integer', 'min:0', 'max:16'],
            'displacement' => ['nullable', 'string', 'max:100'],
            'drive_type' => ['nullable', 'string', 'max:100'],
            'title_code' => ['nullable', 'string', 'max:255'],
            'sale_date' => ['nullable', 'string', 'max:50'],
            'sale_time' => ['nullable', 'string', 'max:50'],
            'sale_location' => ['nullable', 'string', 'max:255'],
            'has_keys' => ['boolean'],
            'damage_type' => ['nullable', 'string', 'max:255'],
            'damage_severity' => ['nullable', 'string', 'in:none,minor,moderate,severe'],
            'damage_description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'run_and_drive' => ['boolean'],
            'highlights' => ['array'],
            'highlights.*' => ['string'],
        ]);
    }

    /** Slug legible (marca-modelo-año); si ya existe, le agrega un sufijo. */
    private function uniqueSlug(string $brand, string $model, int $year): string
    {
        $base = Str::slug("{$brand}-{$model}-{$year}");
        $slug = $base;
        $suffix = 1;
        while (CatalogVehicle::whereKey($slug)->exists()) {
            $slug = "{$base}-" . ++$suffix;
        }

        return $slug;
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
            'top_speed_kmh' => $v->top_speed_kmh,
            'zero_to_hundred_sec' => $v->zero_to_hundred_sec,
            'availability' => $v->availability,
            'features' => $v->features,
            'image_url' => $v->image_url,
            'accent_from' => $v->accent_from,
            'accent_to' => $v->accent_to,
            'highlighted' => $v->highlighted,
            'color' => $v->color,
            'doors' => $v->doors,
            'cylinders' => $v->cylinders,
            'displacement' => $v->displacement,
            'drive_type' => $v->drive_type,
            'title_code' => $v->title_code,
            'sale_date' => $v->sale_date,
            'sale_time' => $v->sale_time,
            'sale_location' => $v->sale_location,
            'has_keys' => $v->has_keys,
            'damage_type' => $v->damage_type,
            'damage_severity' => $v->damage_severity,
            'damage_description' => $v->damage_description,
            'notes' => $v->notes,
            'run_and_drive' => $v->run_and_drive,
            'highlights' => $v->highlights,
        ];
    }
}
