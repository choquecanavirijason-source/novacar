<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Paso 3 del buscador: años disponibles para una marca y modelo.
 */
class VehicleYearsRequest extends FormRequest
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
            'model' => ['required', 'string', 'max:120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'brand.required' => 'Selecciona una marca para continuar.',
            'model.required' => 'Selecciona un modelo para continuar.',
        ];
    }

    public function brand(): string
    {
        return (string) $this->validated('brand');
    }

    public function model(): string
    {
        return (string) $this->validated('model');
    }
}
