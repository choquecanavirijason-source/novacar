<?php

declare(strict_types=1);

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/** Tipo de combustible / tren motriz. */
enum FuelType: string
{
    use HasValues;

    case Gasolina = 'gasolina';
    case Hibrido = 'hibrido';
    case Electrico = 'electrico';
    case Diesel = 'diesel';

    public function label(): string
    {
        return match ($this) {
            self::Gasolina => 'Gasolina',
            self::Hibrido => 'Híbrido',
            self::Electrico => 'Eléctrico',
            self::Diesel => 'Diésel',
        };
    }

    /** Un eléctrico puro no declara cilindros: se fuerza a 0 en el alta. */
    public function hasCylinders(): bool
    {
        return $this !== self::Electrico;
    }
}
