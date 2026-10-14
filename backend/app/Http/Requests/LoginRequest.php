<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Inicio de sesión (`POST /api/auth/login`). Endpoint público con throttle.
 */
class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('email'))) {
            $this->merge(['email' => mb_strtolower(trim($this->string('email')->toString()))]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email:rfc', 'max:180'],
            'password' => ['required', 'string', 'max:255'],
            'device_name' => ['nullable', 'string', 'max:80'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Ingresa tu correo.',
            'email.email' => 'El correo no tiene un formato válido.',
            'password.required' => 'Ingresa tu contraseña.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return ['email' => 'correo', 'password' => 'contraseña'];
    }

    /** Nombre del token Sanctum; permite revocar sesiones por dispositivo. */
    public function deviceName(): string
    {
        $name = $this->input('device_name');

        return is_string($name) && trim($name) !== '' ? trim($name) : 'novacar-web';
    }
}
