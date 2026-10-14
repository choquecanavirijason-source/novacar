<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompatiblePartsRequest;
use App\Http\Requests\VehicleModelsRequest;
use App\Http\Requests\VehicleYearsRequest;
use App\Http\Resources\CompatiblePartResource;
use App\Http\Resources\MarketplacePartResource;
use App\Models\CompatiblePart;
use App\Models\VehicleFitment;
use App\Services\MarketplacePartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Buscador guiado por pasos: marca → modelo → año → categoría.
 *
 * Las tres primeras respuestas salen de `vehicle_fitments`, que
 * CatalogVehicleService mantiene sincronizado con el catálogo real: publicar un
 * auto habilita automáticamente su marca en el wizard.
 */
final class SearchController extends Controller
{
    public function __construct(private readonly MarketplacePartService $parts) {}

    /** GET /api/vehicles/brands */
    public function brands(): JsonResponse
    {
        return response()->json(
            VehicleFitment::query()->distinct()->orderBy('brand')->pluck('brand')
        );
    }

    /** GET /api/vehicles/models?brand=Nissan */
    public function models(VehicleModelsRequest $request): JsonResponse
    {
        return response()->json(
            VehicleFitment::query()
                ->ofBrand($request->brand())
                ->distinct()
                ->orderBy('model')
                ->pluck('model')
        );
    }

    /** GET /api/vehicles/years?brand=Nissan&model=Versa */
    public function years(VehicleYearsRequest $request): JsonResponse
    {
        return response()->json(
            VehicleFitment::query()
                ->ofBrand($request->brand())
                ->ofModel($request->model())
                ->distinct()
                ->orderByDesc('year')
                ->pluck('year')
        );
    }

    /**
     * GET /api/parts/compatible?brand=Nissan&year=2021&category=battery
     *
     * Con marca y año resuelve la compatibilidad real del marketplace; sin
     * ellos conserva el comportamiento legado: catálogo técnico por categoría.
     */
    public function compatibleParts(CompatiblePartsRequest $request): AnonymousResourceCollection
    {
        if ($request->hasVehicleContext()) {
            return MarketplacePartResource::collection(
                $this->parts->compatibleWith(
                    $request->brand(),
                    $request->year(),
                    $request->category(),
                )
            );
        }

        return CompatiblePartResource::collection(
            CompatiblePart::query()
                ->ofCategory($request->rawCategory())
                ->storefrontOrder()
                ->get()
        );
    }
}
