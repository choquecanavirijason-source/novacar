<?php

declare(strict_types=1);

namespace App\Http\Requests;

/**
 * Ajuste de stock del inventario operativo
 * (`PATCH /api/admin/inventory/{item}/stock`).
 */
class UpdateInventoryStockRequest extends StaffRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'stock' => ['required', 'integer', 'min:0', 'max:1000000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'stock.required' => 'Indica el nuevo stock.',
            'stock.min' => 'El stock no puede ser negativo.',
        ];
    }

    public function stock(): int
    {
        return (int) $this->validated('stock');
    }
}
