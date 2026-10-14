<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Acepta las tres formas de imagen que produce el panel:
 * una URL absoluta, una ruta relativa del sitio (`/vehicles/bmw.png`) o una
 * Data URL generada por el ImageUrlField al subir un archivo.
 *
 * Acota además el tamaño para que una foto enorme no reviente la columna ni
 * el límite de payload de PHP.
 */
final class ImageReference implements ValidationRule
{
    /** ~2 MB de texto: una Data URL más grande que eso debe ir a un CDN. */
    private const MAX_LENGTH = 2_097_152;

    private const DATA_URL_PATTERN = '/^data:image\/(png|jpe?g|gif|webp|avif|svg\+xml);base64,[A-Za-z0-9+\/=\s]+$/';

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value)) {
            $fail('El campo :attribute debe ser una referencia de imagen válida.');

            return;
        }

        if (mb_strlen($value) > self::MAX_LENGTH) {
            $fail('La imagen de :attribute supera el tamaño máximo permitido (2 MB).');

            return;
        }

        if (str_starts_with($value, 'data:')) {
            if (preg_match(self::DATA_URL_PATTERN, $value) !== 1) {
                $fail('El campo :attribute no es una imagen embebida válida.');
            }

            return;
        }

        if (str_starts_with($value, '/')) {
            return;
        }

        if (filter_var($value, FILTER_VALIDATE_URL) === false) {
            $fail('El campo :attribute debe ser una URL válida, una ruta del sitio o una imagen embebida.');
        }
    }
}
