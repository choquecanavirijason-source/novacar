<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/**
 * Registro público de clientes (`POST /api/auth/register`).
 *
 * El rol NO forma parte del payload: el servicio siempre crea un `customer`,
 * de modo que nadie pueda auto-asignarse acceso al panel.
 */
class RegisterRequest extends FormRequest
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
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => [
                'required', 'string', 'email:rfc', 'max:180',
                Rule::unique(User::class, 'email'),
            ],
            // Teléfono internacional flexible: dígitos, espacios, guiones y +.
            'phone' => ['nullable', 'string', 'max:32', 'regex:/^\+?[0-9\s\-()]{6,32}$/'],
            'password' => ['required', 'string', Password::min(8)->letters()->numbers(), 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Ingresa tu nombre.',
            'email.unique' => 'Ese correo ya está registrado.',
            'phone.regex' => 'El teléfono solo admite números, espacios, guiones y el prefijo +.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'email' => 'correo',
            'phone' => 'teléfono',
            'password' => 'contraseña',
        ];
    }
}
