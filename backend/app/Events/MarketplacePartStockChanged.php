<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\MarketplacePart;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Cambió el stock de una autoparte (alta, edición o ajuste manual).
 */
final class MarketplacePartStockChanged
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(
        public readonly MarketplacePart $part,
        public readonly int $previousStock,
        public readonly int $currentStock,
        public readonly ?string $reason = null,
    ) {}

    public function delta(): int
    {
        return $this->currentStock - $this->previousStock;
    }

    /** El movimiento dejó la pieza en o por debajo del umbral de reorden. */
    public function crossedReorderThreshold(): bool
    {
        return $this->currentStock <= $this->part->reorder_level
            && $this->previousStock > $this->part->reorder_level;
    }
}
