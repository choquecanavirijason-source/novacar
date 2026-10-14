<?php

declare(strict_types=1);

namespace App\Http\Requests;

/**
 * Encendido/apagado del banner desde la celda de la tabla
 * (`PATCH /api/admin/banners/{banner}/active`).
 */
class ToggleBannerRequest extends StaffRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'active' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'active.required' => 'Indica si el banner queda activo o inactivo.',
            'active.boolean' => 'El estado del banner solo acepta verdadero o falso.',
        ];
    }

    public function isActive(): bool
    {
        return $this->boolean('active');
    }
}
