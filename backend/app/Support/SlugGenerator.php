<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Str;

/**
 * Genera identificadores legibles y únicos (`nissan-versa-sense-2021`).
 *
 * No conoce Eloquent: recibe un callback que responde si un candidato ya está
 * ocupado. Así se puede testear sin base de datos y reutilizar para cualquier
 * tabla (DIP: el servicio decide contra qué se comprueba la unicidad).
 */
final class SlugGenerator
{
    private const MAX_ATTEMPTS = 50;

    /**
     * @param  callable(string): bool  $exists  Devuelve true si el slug ya está tomado.
     */
    public function generate(string $source, callable $exists, int $maxLength = 120): string
    {
        $base = Str::limit(Str::slug($source), $maxLength, '');

        if ($base === '') {
            $base = 'item';
        }

        if (! $exists($base)) {
            return $base;
        }

        for ($suffix = 2; $suffix <= self::MAX_ATTEMPTS; $suffix++) {
            $candidate = "{$base}-{$suffix}";

            if (! $exists($candidate)) {
                return $candidate;
            }
        }

        // Salida garantizada cuando hay una colisión masiva de nombres.
        return $base.'-'.Str::lower(Str::random(6));
    }
}
