<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\CatalogVehicle;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class CatalogVehicleUpdated
{
    use Dispatchable;
    use SerializesModels;

    /**
     * @param  array<string, mixed>  $changes  Atributos que realmente cambiaron.
     */
    public function __construct(
        public readonly CatalogVehicle $vehicle,
        public readonly array $changes = [],
    ) {}
}
