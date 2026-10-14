<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;

/**
 * Tablero del panel (`GET /api/admin/analytics`).
 *
 * Controlador de una sola acción: no hay nada que agrupar aquí.
 */
final class AnalyticsController extends Controller
{
    public function __construct(
        private readonly AnalyticsService $analytics,
        private readonly InventoryService $inventory,
    ) {}

    public function __invoke(): JsonResponse
    {
        return response()->json([
            ...$this->analytics->dashboard(),
            'top_selling_parts' => $this->inventory->topSelling(),
        ]);
    }
}
