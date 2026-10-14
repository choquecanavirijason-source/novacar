<?php

declare(strict_types=1);

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum VehicleCondition: string
{
    use HasValues;

    case Nuevo = 'nuevo';
    case Seminuevo = 'seminuevo';

    public function label(): string
    {
        return match ($this) {
            self::Nuevo => 'Nuevo',
            self::Seminuevo => 'Seminuevo',
        };
    }

    /** Regla de negocio: un auto declarado nuevo no puede traer kilometraje. */
    public function allowsMileage(): bool
    {
        return $this === self::Seminuevo;
    }
}
