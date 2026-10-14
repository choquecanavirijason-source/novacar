<?php

declare(strict_types=1);

namespace App\Http\Requests;

/**
 * Edición de vehículo (`PUT /api/admin/catalog/vehicles/{vehicle}`).
 *
 * El frontend envía siempre el objeto completo (semántica PUT, no PATCH), así
 * que reutiliza tal cual el conjunto de reglas del alta. Se mantiene como clase
 * propia para poder divergir sin tocar el alta y para que el contenedor pueda
 * inyectar la autorización por policy en el futuro.
 */
class UpdateCatalogVehicleRequest extends StoreCatalogVehicleRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return parent::rules();
    }
}
