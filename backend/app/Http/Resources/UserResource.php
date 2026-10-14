<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Espejo de `AuthUser` del frontend.
 *
 * Nunca expone hash de contraseña ni token de recordatorio: el modelo los
 * oculta y aquí se listan los campos uno por uno, no con `toArray()`.
 *
 * @mixin User
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // El frontend tipa el id como string.
            'id' => (string) $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role->value,
            'role_label' => $this->role->label(),

            // Solo para la propia cuenta: no se filtra actividad de terceros.
            'last_login_at' => $this->when(
                $request->user()?->getKey() === $this->getKey(),
                fn (): ?string => $this->last_login_at?->toIso8601String(),
            ),
        ];
    }
}
