<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\DataTransferObjects\BannerData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReorderBannersRequest;
use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\ToggleBannerRequest;
use App\Http\Requests\UpdateBannerRequest;
use App\Http\Resources\BannerResource;
use App\Services\BannerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * Gestión de banners del panel (`/api/admin/banners`).
 */
final class BannerController extends Controller
{
    public function __construct(private readonly BannerService $banners) {}

    /** GET /api/admin/banners */
    public function index(): AnonymousResourceCollection
    {
        return BannerResource::collection($this->banners->list());
    }

    /** POST /api/admin/banners */
    public function store(StoreBannerRequest $request): JsonResponse
    {
        $banner = $this->banners->create(BannerData::fromRequest($request), $request->user());

        return (new BannerResource($banner))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /** PUT /api/admin/banners/{banner} */
    public function update(UpdateBannerRequest $request, string $banner): BannerResource
    {
        return new BannerResource(
            $this->banners->update($banner, BannerData::fromRequest($request))
        );
    }

    /** PATCH /api/admin/banners/{banner}/active */
    public function toggleActive(ToggleBannerRequest $request, string $banner): BannerResource
    {
        return new BannerResource(
            $this->banners->toggleActive($banner, $request->isActive())
        );
    }

    /**
     * PATCH /api/admin/banners/reorder
     *
     * Devuelve la lista completa ya reordenada para que la tabla del panel
     * pueda reemplazar su estado sin una segunda petición.
     */
    public function reorder(ReorderBannersRequest $request): AnonymousResourceCollection
    {
        return BannerResource::collection($this->banners->reorder($request->orderedIds()));
    }

    /** DELETE /api/admin/banners/{banner} */
    public function destroy(string $banner): Response
    {
        $this->banners->delete($banner);

        return response()->noContent();
    }
}
