<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\BodyType;
use App\Enums\DamageSeverity;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\VehicleCondition;
use App\Rules\ImageReference;
use Illuminate\Validation\Rule;

/**
 * Alta de vehículo desde el panel (`POST /api/admin/catalog/vehicles`).
 *
 * El payload es el que produce `toCatalogVehiclePayload()` del frontend, así
 * que los nombres son snake_case y el objeto llega completo.
 */
class StoreCatalogVehicleRequest extends StaffRequest
{
    /**
     * Normaliza lo que el formulario manda "en crudo" antes de validar:
     * el campo de características puede llegar como texto separado por comas.
     */
    protected function prepareForValidation(): void
    {
        foreach (['features', 'highlights'] as $listField) {
            $value = $this->input($listField);

            if (is_string($value)) {
                $this->merge([
                    $listField => array_values(array_filter(
                        array_map(trim(...), explode(',', $value)),
                        static fn (string $item): bool => $item !== '',
                    )),
                ]);
            }
        }

        if (is_string($this->input('brand'))) {
            $this->merge(['brand' => trim($this->string('brand')->toString())]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $nextYear = (int) date('Y') + 1;

        return [
            'brand' => ['required', 'string', 'max:80'],
            'model' => ['required', 'string', 'max:120'],
            'year' => ['required', 'integer', 'between:1980,'.$nextYear],
            'price' => ['required', 'integer', 'min:1', 'max:99999999'],
            'tagline' => ['nullable', 'string', 'max:255'],

            'body_type' => ['required', Rule::enum(BodyType::class)],
            'fuel_type' => ['required', Rule::enum(FuelType::class)],
            'transmission' => ['required', Rule::enum(TransmissionType::class)],
            'condition' => ['required', Rule::enum(VehicleCondition::class)],

            'mileage_km' => ['required', 'integer', 'min:0', 'max:2000000'],
            'horsepower' => ['required', 'integer', 'min:0', 'max:2000'],
            'seats' => ['required', 'integer', 'min:1', 'max:9'],

            'features' => ['present', 'array', 'max:30'],
            'features.*' => ['required', 'string', 'max:120'],
            'highlights' => ['sometimes', 'array', 'max:20'],
            'highlights.*' => ['required', 'string', 'max:120'],

            'image_url' => ['nullable', new ImageReference],
            'accent_from' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'accent_to' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'highlighted' => ['required', 'boolean'],

            // Ficha extendida: opcional, con defaults en el DTO.
            'color' => ['nullable', 'string', 'max:120'],
            'doors' => ['nullable', 'integer', 'min:0', 'max:8'],
            'cylinders' => ['nullable', 'integer', 'min:0', 'max:16'],
            'displacement' => ['nullable', 'string', 'max:60'],
            'drive_type' => ['nullable', 'string', 'max:60'],
            'title_code' => ['nullable', 'string', 'max:120'],
            'sale_date' => ['nullable', 'date_format:Y-m-d'],
            'sale_time' => ['nullable', 'string', 'max:60'],
            'sale_location' => ['nullable', 'string', 'max:120'],
            'has_keys' => ['nullable', 'boolean'],
            'run_and_drive' => ['nullable', 'boolean'],
            'damage_type' => ['nullable', 'string', 'max:160'],
            'damage_severity' => ['nullable', Rule::enum(DamageSeverity::class)],
            'damage_description' => ['nullable', 'string', 'max:2000'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Reglas cruzadas que dependen de más de un campo.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (\Illuminate\Validation\Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $isNew = $this->input('condition') === VehicleCondition::Nuevo->value;

                if ($isNew && (int) $this->input('mileage_km', 0) > 1000) {
                    $validator->errors()->add(
                        'mileage_km',
                        'Un vehículo nuevo no puede registrar más de 1 000 km.',
                    );
                }

                $severity = DamageSeverity::tryFrom((string) $this->input('damage_severity', 'none'));

                if ($severity !== null && $severity !== DamageSeverity::None
                    && trim((string) $this->input('damage_description', '')) === '') {
                    $validator->errors()->add(
                        'damage_description',
                        'Describe el daño cuando la severidad es distinta de "sin daños".',
                    );
                }
            },
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'integer' => 'El campo :attribute debe ser un número entero.',
            'boolean' => 'El campo :attribute solo acepta verdadero o falso.',
            'array' => 'El campo :attribute debe ser una lista.',
            'year.between' => 'El año debe estar entre 1980 y el año siguiente al actual.',
            'price.min' => 'El precio debe ser mayor a cero.',
            'accent_from.regex' => 'El color de acento inicial debe ser hexadecimal (por ejemplo #005f8f).',
            'accent_to.regex' => 'El color de acento final debe ser hexadecimal (por ejemplo #00aaff).',
            'features.max' => 'No puedes registrar más de 30 características.',
            'sale_date.date_format' => 'La fecha de venta debe tener el formato AAAA-MM-DD.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'brand' => 'marca',
            'model' => 'modelo',
            'year' => 'año',
            'price' => 'precio',
            'tagline' => 'descripción corta',
            'body_type' => 'carrocería',
            'fuel_type' => 'combustible',
            'transmission' => 'transmisión',
            'condition' => 'condición',
            'mileage_km' => 'kilometraje',
            'horsepower' => 'potencia',
            'seats' => 'asientos',
            'features' => 'características',
            'highlights' => 'puntos destacados',
            'image_url' => 'imagen',
            'accent_from' => 'color de acento inicial',
            'accent_to' => 'color de acento final',
            'highlighted' => 'destacado',
            'damage_severity' => 'severidad del daño',
            'damage_description' => 'descripción del daño',
        ];
    }
}
