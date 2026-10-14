<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\CatalogVehicle;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Se publicó un vehículo nuevo en el catálogo.
 *
 * Permite enganchar efectos secundarios (indexado, aviso a suscriptores,
 * invalidación de caché del home) sin engordar el servicio.
 */
final class CatalogVehiclePublished
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public readonly CatalogVehicle $vehicle) {}
}
