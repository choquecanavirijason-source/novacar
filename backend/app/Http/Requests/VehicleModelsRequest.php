<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Paso 2 del buscador: modelos disponibles para una marca.
 */
class VehicleModelsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'brand' => ['required', 'string', 'max:80'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return ['brand.required' => 'Selecciona una marca para continuar.'];
    }

    public function brand(): string
    {
        return (string) $this->validated('brand');
    }
}
