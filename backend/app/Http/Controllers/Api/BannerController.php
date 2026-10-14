<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Services\BannerService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Banners visibles en el home. Si no hay ninguno activo devuelve una lista
 * vacía y el frontend simplemente no pinta la franja.
 */
final class BannerController extends Controller
{
    public function __construct(private readonly BannerService $banners) {}

    /** GET /api/banners */
    public function index(): AnonymousResourceCollection
    {
        return BannerResource::collection($this->banners->activeForSite());
    }
}
