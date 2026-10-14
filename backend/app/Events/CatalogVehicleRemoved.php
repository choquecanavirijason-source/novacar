<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;

/**
 * Se retiró un vehículo del catálogo (borrado lógico).
 *
 * Transporta datos planos, no el modelo: el registro ya no debe considerarse
 * consultable por los listeners.
 */
final class CatalogVehicleRemoved
{
    use Dispatchable;

    public function __construct(
        public readonly string $vehicleId,
        public readonly string $fullName,
    ) {}
}
