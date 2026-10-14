<?php

declare(strict_types=1);

namespace App\Enums\Concerns;

/**
 * Utilidades compartidas por todos los enums respaldados (backed enums) del dominio.
 * Evita repetir el mismo `array_column` en cada regla de validación.
 */
trait HasValues
{
    /**
     * Lista plana de valores válidos, pensada para `Rule::in(...)`.
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Resuelve un valor crudo o devuelve el fallback indicado.
     */
    public static function fromValueOr(?string $value, self $fallback): self
    {
        if ($value === null) {
            return $fallback;
        }

        return self::tryFrom($value) ?? $fallback;
    }
}
