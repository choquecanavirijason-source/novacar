<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\DataTransferObjects\MarketplacePartData;
use App\DataTransferObjects\PartFilters;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarketplacePartRequest;
use App\Http\Requests\UpdateMarketplacePartRequest;
use App\Http\Requests\UpdatePartStockRequest;
use App\Http\Resources\MarketplacePartResource;
use App\Services\MarketplacePartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * CRUD de autopartes del panel (`/api/admin/marketplace/parts`).
 */
final class PartController extends Controller
{
    public function __construct(private readonly MarketplacePartService $parts) {}

    /** GET /api/admin/marketplace/parts */
    public function index(Request $request): AnonymousResourceCollection
    {
        return MarketplacePartResource::collection(
            $this->parts->list(PartFilters::fromRequest($request))
        );
    }

    /** POST /api/admin/marketplace/parts */
    public function store(StoreMarketplacePartRequest $request): JsonResponse
    {
        $part = $this->parts->create(MarketplacePartData::fromRequest($request));

        return (new MarketplacePartResource($part))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /** GET /api/admin/marketplace/parts/{part} */
    public function show(string $part): MarketplacePartResource
    {
        return new MarketplacePartResource($this->parts->findOrFail($part));
    }

    /** PUT /api/admin/marketplace/parts/{part} */
    public function update(UpdateMarketplacePartRequest $request, string $part): MarketplacePartResource
    {
        return new MarketplacePartResource(
            $this->parts->update($part, MarketplacePartData::fromRequest($request))
        );
    }

    /** DELETE /api/admin/marketplace/parts/{part} */
    public function destroy(string $part): Response
    {
        $this->parts->delete($part);

        return response()->noContent();
    }

    /**
     * PATCH /api/admin/marketplace/parts/{part}/stock
     *
     * Acepta stock absoluto o delta; el request garantiza que llegue uno y
     * solo uno de los dos.
     */
    public function updateStock(UpdatePartStockRequest $request, string $part): MarketplacePartResource
    {
        $absolute = $request->absoluteStock();

        $updated = $absolute !== null
            ? $this->parts->setStock($part, $absolute, $request->reason())
            : $this->parts->adjustStock($part, (int) $request->adjustment(), $request->reason());

        return new MarketplacePartResource($updated);
    }
}
