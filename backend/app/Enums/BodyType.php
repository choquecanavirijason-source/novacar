<?php

declare(strict_types=1);

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/** Carrocería del vehículo (CatalogVehicle.bodyType en el frontend). */
enum BodyType: string
{
    use HasValues;

    case Sedan = 'sedan';
    case Suv = 'suv';
    case Hatchback = 'hatchback';
    case Pickup = 'pickup';
    case Motocicleta = 'motocicleta';

    public function label(): string
    {
        return match ($this) {
            self::Sedan => 'Sedán',
            self::Suv => 'SUV',
            self::Hatchback => 'Hatchback',
            self::Pickup => 'Pickup',
            self::Motocicleta => 'Motocicleta',
        };
    }

    /** Las motocicletas no tienen puertas: regla usada al normalizar el alta. */
    public function hasDoors(): bool
    {
        return $this !== self::Motocicleta;
    }
}
