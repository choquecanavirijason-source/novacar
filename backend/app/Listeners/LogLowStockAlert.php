<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\MarketplacePartStockChanged;
use Illuminate\Support\Facades\Log;

/**
 * Deja rastro cuando una pieza cruza el umbral de reorden, que es la señal que
 * el panel muestra como alerta en Analytics.
 */
final class LogLowStockAlert
{
    public function handle(MarketplacePartStockChanged $event): void
    {
        if (! $event->crossedReorderThreshold()) {
            return;
        }

        Log::warning('Autoparte por debajo del umbral de reorden', [
            'part_id' => $event->part->id,
            'sku' => $event->part->sku,
            'name' => $event->part->name,
            'stock' => $event->currentStock,
            'reorder_level' => $event->part->reorder_level,
            'reason' => $event->reason,
        ]);
    }
}
