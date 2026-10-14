<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\InventoryItem;
use Illuminate\Validation\Rule;

/**
 * Alta de ítem en el inventario operativo (`POST /api/admin/inventory`).
 */
class StoreInventoryItemRequest extends StaffRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:180'],
            'category' => ['required', 'string', Rule::in(['vehicle', 'battery', 'fuse'])],
            'sku' => ['nullable', 'string', 'max:60', Rule::unique(InventoryItem::class, 'sku')],
            'price' => ['required', 'integer', 'min:0', 'max:99999999'],
            'stock' => ['required', 'integer', 'min:0', 'max:1000000'],
            'reorder_level' => ['required', 'integer', 'min:0', 'max:100000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'category.in' => 'La categoría debe ser vehicle, battery o fuse.',
            'sku.unique' => 'Ya existe un ítem con ese SKU.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre',
            'category' => 'categoría',
            'price' => 'precio',
            'stock' => 'stock',
            'reorder_level' => 'umbral de reorden',
        ];
    }
}
