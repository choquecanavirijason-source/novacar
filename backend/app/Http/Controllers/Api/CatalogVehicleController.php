<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\DataTransferObjects\VehicleFilters;
use App\Http\Controllers\Controller;
use App\Http\Resources\CatalogVehicleResource;
use App\Services\CatalogVehicleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Catálogo público de vehículos (lectura).
 *
 * Controlador delgado: resuelve filtros, delega en el servicio y formatea.
 */
final class CatalogVehicleController extends Controller
{
    public function __construct(private readonly CatalogVehicleService $vehicles) {}

    /** GET /api/catalog/vehicles */
    public function index(Request $request): AnonymousResourceCollection
    {
        return CatalogVehicleResource::collection(
            $this->vehicles->list(VehicleFilters::fromRequest($request))
        );
    }

    /**
     * GET /api/catalog/vehicles/{vehicle}
     *
     * El 404 lo produce ResourceNotFoundException desde el servicio.
     */
    public function show(string $vehicle): CatalogVehicleResource
    {
        return new CatalogVehicleResource($this->vehicles->findOrFail($vehicle));
    }

    /** GET /api/catalog/vehicles/featured */
    public function featured(): AnonymousResourceCollection
    {
        return CatalogVehicleResource::collection($this->vehicles->featured());
    }

    /**
     * GET /api/catalog/filters
     *
     * Facetas reales del dataset para poblar los selectores del buscador.
     */
    public function filters(): JsonResponse
    {
        return response()->json($this->vehicles->filterOptions());
    }
}
