<?php

declare(strict_types=1);

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/** Severidad del daño reportado en la ficha extendida del vehículo. */
enum DamageSeverity: string
{
    use HasValues;

    case None = 'none';
    case Minor = 'minor';
    case Moderate = 'moderate';
    case Severe = 'severe';

    public function label(): string
    {
        return match ($this) {
            self::None => 'Sin daños',
            self::Minor => 'Daños menores',
            self::Moderate => 'Daños moderados',
            self::Severe => 'Daños severos',
        };
    }

    /** Peso numérico para ordenar o filtrar por gravedad. */
    public function weight(): int
    {
        return match ($this) {
            self::None => 0,
            self::Minor => 1,
            self::Moderate => 2,
            self::Severe => 3,
        };
    }
}
