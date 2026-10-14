<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\DataTransferObjects\CatalogVehicleData;
use App\DataTransferObjects\VehicleFilters;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCatalogVehicleRequest;
use App\Http\Requests\UpdateCatalogVehicleRequest;
use App\Http\Resources\CatalogVehicleResource;
use App\Services\CatalogVehicleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * CRUD de vehículos del panel (`/api/admin/catalog/vehicles`).
 *
 * Sin Eloquent, sin validación y sin reglas de negocio: solo traduce HTTP a
 * llamadas del servicio. Los errores de negocio se convierten en respuesta
 * mediante DomainException::render().
 */
final class VehicleController extends Controller
{
    public function __construct(private readonly CatalogVehicleService $vehicles) {}

    /** GET /api/admin/catalog/vehicles */
    public function index(Request $request): AnonymousResourceCollection
    {
        return CatalogVehicleResource::collection(
            $this->vehicles->list(VehicleFilters::fromRequest($request))
        );
    }

    /** POST /api/admin/catalog/vehicles */
    public function store(StoreCatalogVehicleRequest $request): JsonResponse
    {
        $vehicle = $this->vehicles->create(CatalogVehicleData::fromRequest($request));

        return (new CatalogVehicleResource($vehicle))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /** GET /api/admin/catalog/vehicles/{vehicle} */
    public function show(string $vehicle): CatalogVehicleResource
    {
        return new CatalogVehicleResource($this->vehicles->findOrFail($vehicle));
    }

    /** PUT /api/admin/catalog/vehicles/{vehicle} */
    public function update(UpdateCatalogVehicleRequest $request, string $vehicle): CatalogVehicleResource
    {
        return new CatalogVehicleResource(
            $this->vehicles->update($vehicle, CatalogVehicleData::fromRequest($request))
        );
    }

    /** DELETE /api/admin/catalog/vehicles/{vehicle} */
    public function destroy(string $vehicle): Response
    {
        $this->vehicles->delete($vehicle);

        return response()->noContent();
    }

    /** POST /api/admin/catalog/vehicles/{vehicle}/restore */
    public function restore(string $vehicle): CatalogVehicleResource
    {
        return new CatalogVehicleResource($this->vehicles->restore($vehicle));
    }
}
