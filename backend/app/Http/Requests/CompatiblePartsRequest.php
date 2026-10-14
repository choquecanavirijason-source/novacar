<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\PartCategory;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Paso 4 del buscador: piezas compatibles con el vehículo elegido.
 *
 * Marca y año son opcionales para conservar el comportamiento legado del
 * endpoint (listado técnico por categoría) cuando el wizard aún no los tiene.
 */
class CompatiblePartsRequest extends FormRequest
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
            'brand' => ['nullable', 'string', 'max:80', 'required_with:year'],
            'year' => ['nullable', 'integer', 'between:1950,2100', 'required_with:brand'],
            'category' => ['nullable', 'string', 'max:40'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'brand.required_with' => 'Para filtrar por año también hace falta la marca.',
            'year.required_with' => 'Para filtrar por marca también hace falta el año.',
        ];
    }

    /** El wizard entregó vehículo completo: se resuelve compatibilidad real. */
    public function hasVehicleContext(): bool
    {
        return $this->filled('brand') && $this->filled('year');
    }

    public function brand(): string
    {
        return (string) $this->validated('brand');
    }

    public function year(): int
    {
        return (int) $this->validated('year');
    }

    public function rawCategory(): ?string
    {
        $category = $this->validated('category');

        return is_string($category) && $category !== '' ? $category : null;
    }

    public function category(): ?PartCategory
    {
        return PartCategory::tryFrom((string) $this->rawCategory());
    }
}
