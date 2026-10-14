<?php

declare(strict_types=1);

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/** Formulario público que originó la cotización. */
enum QuoteSource: string
{
    use HasValues;

    case Import = 'import';
    case Inquiry = 'inquiry';
    case TestDrive = 'test_drive';

    public function label(): string
    {
        return match ($this) {
            self::Import => 'Cotización de importación',
            self::Inquiry => 'Consulta de producto',
            self::TestDrive => 'Prueba de manejo',
        };
    }

    /** Solo la importación transporta un monto estimado. */
    public function requiresAmount(): bool
    {
        return $this === self::Import;
    }
}
