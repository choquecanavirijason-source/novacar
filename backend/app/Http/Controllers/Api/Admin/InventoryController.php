<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInventoryItemRequest;
use App\Http\Requests\UpdateInventoryStockRequest;
use App\Http\Resources\InventoryItemResource;
use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * Inventario operativo del panel (`/api/admin/inventory`).
 */
final class InventoryController extends Controller
{
    public function __construct(private readonly InventoryService $inventory) {}

    /** GET /api/admin/inventory */
    public function index(Request $request): AnonymousResourceCollection
    {
        $category = $request->query('category');

        return InventoryItemResource::collection(
            $this->inventory->list(is_string($category) && $category !== '' ? $category : null)
        );
    }

    /** POST /api/admin/inventory */
    public function store(StoreInventoryItemRequest $request): JsonResponse
    {
        $item = $this->inventory->create($request->validated());

        return (new InventoryItemResource($item))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /** PATCH /api/admin/inventory/{item}/stock */
    public function updateStock(UpdateInventoryStockRequest $request, string $item): InventoryItemResource
    {
        return new InventoryItemResource(
            $this->inventory->updateStock($item, $request->stock())
        );
    }
}
