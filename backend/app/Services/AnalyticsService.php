<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Banner;
use App\Models\CatalogVehicle;
use App\Models\MarketplacePart;
use Illuminate\Support\Facades\DB;

/**
 * Métricas del tablero administrativo.
 *
 * Todas las cifras salen de la base: ningún KPI está inventado ni hardcodeado.
 * Las agregaciones se resuelven en SQL, no cargando colecciones a memoria.
 */
final class AnalyticsService
{
    public function __construct(private readonly QuoteRequestService $quoteRequests) {}

    /**
     * @return array<string, mixed>
     */
    public function dashboard(): array
    {
        return [
            'stats' => $this->stats(),
            'low_stock_parts' => $this->lowStockParts(),
            'parts_by_category' => $this->partsByCategory(),
            'vehicles_by_body_type' => $this->vehiclesByBodyType(),
            'quote_requests' => $this->quoteRequests->summary(),
        ];
    }

    /**
     * @return array<string, int>
     */
    public function stats(): array
    {
        $partAggregates = MarketplacePart::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN free_shipping THEN 1 ELSE 0 END) as free_shipping_total')
            // Valor de inventario = stock x precio final (ya con descuento).
            ->selectRaw('SUM(stock * ROUND(price * (100 - discount_percent) / 100)) as inventory_value')
            ->first();

        return [
            'total_vehicles' => CatalogVehicle::query()->count(),
            'highlighted_vehicles' => CatalogVehicle::query()->highlighted()->count(),
            'total_parts' => (int) ($partAggregates?->total ?? 0),
            'free_shipping_parts' => (int) ($partAggregates?->free_shipping_total ?? 0),
            'low_stock_count' => MarketplacePart::query()->lowStock()->count(),
            'inventory_value' => (int) ($partAggregates?->inventory_value ?? 0),
            'active_banners' => Banner::query()->active()->count(),
            'total_banners' => Banner::query()->count(),
        ];
    }

    /**
     * Top de piezas por déficit (`stock - reorder_level`), que es el orden con
     * el que el panel prioriza la reposición.
     *
     * @return list<array<string, mixed>>
     */
    public function lowStockParts(int $limit = 5): array
    {
        return MarketplacePart::query()
            ->lowStock()
            ->orderByRaw('(stock - reorder_level) ASC')
            ->limit($limit)
            ->get()
            ->map(static fn (MarketplacePart $part): array => [
                'id' => $part->id,
                'sku' => $part->sku,
                'name' => $part->name,
                'stock' => $part->stock,
                'reorder_level' => $part->reorder_level,
                'deficit' => $part->reorder_level - $part->stock,
            ])
            ->all();
    }

    /**
     * @return list<array{category: string, total: int}>
     */
    public function partsByCategory(int $limit = 6): array
    {
        return MarketplacePart::query()
            ->select('category', DB::raw('COUNT(*) as total'))
            ->groupBy('category')
            ->orderByDesc('total')
            ->limit($limit)
            ->get()
            ->map(static fn (MarketplacePart $row): array => [
                'category' => $row->category->value,
                'total' => (int) $row->getAttribute('total'),
            ])
            ->all();
    }

    /**
     * @return list<array{body_type: string, total: int}>
     */
    public function vehiclesByBodyType(): array
    {
        return CatalogVehicle::query()
            ->select('body_type', DB::raw('COUNT(*) as total'))
            ->groupBy('body_type')
            ->orderByDesc('total')
            ->get()
            ->map(static fn (CatalogVehicle $row): array => [
                'body_type' => $row->body_type->value,
                'total' => (int) $row->getAttribute('total'),
            ])
            ->all();
    }
}
