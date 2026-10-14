<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Base de todos los formularios del panel: exige una sesión con rol de staff.
 *
 * Duplica a propósito lo que ya hace el middleware `staff` (defensa en
 * profundidad): si mañana alguien registra la ruta fuera del grupo protegido,
 * el request sigue rechazando la petición.
 */
abstract class StaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $user instanceof User && $user->isStaff();
    }

    protected function failedAuthorization(): void
    {
        throw new AuthorizationException('Necesitas una cuenta de administrador u operador para realizar esta acción.');
    }
}
