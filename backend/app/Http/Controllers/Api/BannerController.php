<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteBanner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BannerController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            SiteBanner::query()
                ->where('active', true)
                ->orderBy('sort_order')
                ->get()
                ->map(fn (SiteBanner $banner) => $this->payload($banner))
        );
    }

    public function adminIndex(): JsonResponse
    {
        return response()->json(
            SiteBanner::query()
                ->orderBy('sort_order')
                ->get()
                ->map(fn (SiteBanner $banner) => $this->payload($banner))
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $data['sort_order'] = ((int) SiteBanner::max('sort_order')) + 1;

        $banner = SiteBanner::create($data);

        return response()->json($this->payload($banner), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $banner = SiteBanner::find($id);
        if (! $banner) {
            return response()->json(['message' => 'Banner no encontrado.'], 404);
        }

        $banner->update($this->validated($request));

        return response()->json($this->payload($banner->fresh()));
    }

    public function toggleActive(Request $request, string $id): JsonResponse
    {
        $banner = SiteBanner::find($id);
        if (! $banner) {
            return response()->json(['message' => 'Banner no encontrado.'], 404);
        }

        $data = $request->validate(['active' => ['required', 'boolean']]);
        $banner->update(['active' => $data['active']]);

        return response()->json($this->payload($banner->fresh()));
    }

    public function reorder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ordered_ids' => ['required', 'array'],
            'ordered_ids.*' => ['string', 'exists:site_banners,id'],
        ]);

        DB::transaction(function () use ($data): void {
            foreach ($data['ordered_ids'] as $index => $id) {
                SiteBanner::whereKey($id)->update(['sort_order' => $index]);
            }
        });

        return $this->adminIndex();
    }

    public function destroy(string $id): JsonResponse
    {
        $banner = SiteBanner::find($id);
        if (! $banner) {
            return response()->json(['message' => 'Banner no encontrado.'], 404);
        }

        $banner->delete();

        return response()->json(null, 204);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'image_url' => ['required', 'string', 'max:16777215'],
            'cta_label' => ['required', 'string', 'max:100'],
            'href' => ['required', 'string', 'max:500'],
            'accent_from' => ['required', 'string', 'max:20'],
            'accent_to' => ['required', 'string', 'max:20'],
            'active' => ['sometimes', 'boolean'],
        ]);
    }

    private function payload(SiteBanner $banner): array
    {
        return [
            'id' => $banner->id,
            'title' => $banner->title,
            'subtitle' => $banner->subtitle ?? '',
            'image_url' => $banner->image_url,
            'cta_label' => $banner->cta_label,
            'href' => $banner->href,
            'accent_from' => $banner->accent_from,
            'accent_to' => $banner->accent_to,
            'active' => $banner->active,
            'order' => $banner->sort_order,
        ];
    }
}
