<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\DataTransferObjects\PartFilters;
use App\Http\Controllers\Controller;
use App\Http\Resources\MarketplacePartResource;
use App\Services\MarketplacePartService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Marketplace público de autopartes (lectura).
 */
final class MarketplacePartController extends Controller
{
    public function __construct(private readonly MarketplacePartService $parts) {}

    /** GET /api/marketplace/parts */
    public function index(Request $request): AnonymousResourceCollection
    {
        return MarketplacePartResource::collection(
            $this->parts->list(PartFilters::fromRequest($request))
        );
    }

    /** GET /api/marketplace/parts/{part} */
    public function show(string $part): MarketplacePartResource
    {
        return new MarketplacePartResource($this->parts->findOrFail($part));
    }
}
