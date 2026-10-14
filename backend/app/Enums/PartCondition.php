<?php

declare(strict_types=1);

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum PartCondition: string
{
    use HasValues;

    case Nuevo = 'nuevo';
    case Usado = 'usado';
    case Reconstruido = 'reconstruido';

    public function label(): string
    {
        return match ($this) {
            self::Nuevo => 'Nuevo',
            self::Usado => 'Usado',
            self::Reconstruido => 'Reconstruido',
        };
    }

    /** Garantía máxima admitida (meses) según la condición de la pieza. */
    public function maxWarrantyMonths(): int
    {
        return match ($this) {
            self::Nuevo => 36,
            self::Reconstruido => 12,
            self::Usado => 6,
        };
    }
}
