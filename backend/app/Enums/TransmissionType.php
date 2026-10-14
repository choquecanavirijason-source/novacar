<?php

declare(strict_types=1);

namespace App\Enums;

use App\Enums\Concerns\HasValues;

enum TransmissionType: string
{
    use HasValues;

    case Manual = 'manual';
    case Automatica = 'automatica';

    public function label(): string
    {
        return match ($this) {
            self::Manual => 'Manual',
            self::Automatica => 'Automática',
        };
    }
}
