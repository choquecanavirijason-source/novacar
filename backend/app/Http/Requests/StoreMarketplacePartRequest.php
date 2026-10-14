<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\PartCategory;
use App\Enums\PartCondition;
use App\Models\MarketplacePart;
use App\Rules\ImageReference;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;
use Illuminate\Validation\Validator;

/**
 * Alta de autoparte (`POST /api/admin/marketplace/parts`).
 */
class StoreMarketplacePartRequest extends StaffRequest
{
    protected function prepareForValidation(): void
    {
        if (is_string($this->input('sku'))) {
            $this->merge(['sku' => strtoupper(trim($this->string('sku')->toString()))]);
        }

        if (is_string($this->input('compatible_brands'))) {
            $this->merge([
                'compatible_brands' => array_values(array_filter(
                    array_map(trim(...), explode(',', $this->string('compatible_brands')->toString())),
                    static fn (string $brand): bool => $brand !== '',
                )),
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $nextYear = (int) date('Y') + 1;

        return [
            'sku' => ['nullable', 'string', 'max:60', 'regex:/^[A-Z0-9\-_.]+$/', $this->skuUniqueRule()],
            'name' => ['required', 'string', 'max:180'],
            'category' => ['required', Rule::enum(PartCategory::class)],
            'brand' => ['required', 'string', 'max:80'],
            'condition' => ['required', Rule::enum(PartCondition::class)],

            'price' => ['required', 'integer', 'min:1', 'max:99999999'],
            'discount_percent' => ['nullable', 'integer', 'min:0', 'max:90'],
            'stock' => ['required', 'integer', 'min:0', 'max:1000000'],
            'reorder_level' => ['required', 'integer', 'min:0', 'max:100000'],

            'image_url' => ['nullable', new ImageReference],
            'rating' => ['nullable', 'numeric', 'between:0,5'],
            'reviews' => ['nullable', 'integer', 'min:0', 'max:1000000'],
            'seller' => ['nullable', 'string', 'max:120'],

            'free_shipping' => ['required', 'boolean'],
            'warranty_months' => ['required', 'integer', 'min:0', 'max:120'],

            'compatible_brands' => ['present', 'array', 'max:40'],
            'compatible_brands.*' => ['required', 'string', 'max:80'],

            'year_from' => ['required', 'integer', 'between:1950,'.$nextYear],
            'year_to' => ['required', 'integer', 'between:1950,'.$nextYear, 'gte:year_from'],

            'specs' => ['present', 'array', 'max:20'],
            'specs.*.label' => ['required', 'string', 'max:60'],
            'specs.*.value' => ['required', 'string', 'max:120'],

            'accent_from' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'accent_to' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
        ];
    }

    /**
     * Unicidad condicional del SKU: en el alta compara contra toda la tabla;
     * la clase de edición la sobreescribe para ignorar la propia fila.
     */
    protected function skuUniqueRule(): Unique
    {
        return Rule::unique(MarketplacePart::class, 'sku')->whereNull('deleted_at');
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $condition = PartCondition::tryFrom((string) $this->input('condition'));
                $warranty = (int) $this->input('warranty_months', 0);

                if ($condition !== null && $warranty > $condition->maxWarrantyMonths()) {
                    $validator->errors()->add(
                        'warranty_months',
                        "Una pieza {$condition->label()} admite como máximo {$condition->maxWarrantyMonths()} meses de garantía.",
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
            'sku.unique' => 'Ya existe otra autoparte registrada con ese SKU.',
            'sku.regex' => 'El SKU solo admite mayúsculas, números, guiones y puntos.',
            'price.min' => 'El precio debe ser mayor a cero.',
            'discount_percent.max' => 'El descuento no puede superar el 90 %.',
            'rating.between' => 'La calificación debe estar entre 0 y 5.',
            'year_to.gte' => 'El año final de compatibilidad no puede ser anterior al inicial.',
            'specs.*.label.required' => 'Cada especificación necesita una etiqueta.',
            'specs.*.value.required' => 'Cada especificación necesita un valor.',
            'accent_from.regex' => 'El color de acento inicial debe ser hexadecimal.',
            'accent_to.regex' => 'El color de acento final debe ser hexadecimal.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'sku' => 'SKU',
            'name' => 'nombre',
            'category' => 'categoría',
            'brand' => 'marca',
            'condition' => 'condición',
            'price' => 'precio',
            'discount_percent' => 'descuento',
            'stock' => 'stock',
            'reorder_level' => 'umbral de reorden',
            'image_url' => 'imagen',
            'rating' => 'calificación',
            'reviews' => 'reseñas',
            'seller' => 'vendedor',
            'free_shipping' => 'envío gratis',
            'warranty_months' => 'garantía',
            'compatible_brands' => 'marcas compatibles',
            'year_from' => 'año inicial',
            'year_to' => 'año final',
            'specs' => 'especificaciones',
        ];
    }
}
