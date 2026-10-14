<?php

declare(strict_types=1);

namespace App\Http\Requests;

/**
 * Ajuste puntual de stock desde el panel.
 *
 * Acepta dos modos excluyentes: fijar el valor absoluto (`stock`) o aplicar un
 * delta (`adjustment`, positivo o negativo) para entradas y salidas.
 */
class UpdatePartStockRequest extends StaffRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'stock' => ['required_without:adjustment', 'prohibits:adjustment', 'integer', 'min:0', 'max:1000000'],
            'adjustment' => ['required_without:stock', 'integer', 'between:-100000,100000'],
            'reason' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'stock.required_without' => 'Indica el stock final o el ajuste a aplicar.',
            'stock.prohibits' => 'Envía el stock absoluto o el ajuste, pero no ambos.',
            'adjustment.required_without' => 'Indica el ajuste o el stock final.',
            'stock.min' => 'El stock no puede ser negativo.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'stock' => 'stock',
            'adjustment' => 'ajuste',
            'reason' => 'motivo',
        ];
    }

    /** Stock absoluto solicitado, si el cliente eligió ese modo. */
    public function absoluteStock(): ?int
    {
        return $this->has('stock') ? (int) $this->input('stock') : null;
    }

    /** Delta solicitado, si el cliente eligió ese modo. */
    public function adjustment(): ?int
    {
        return $this->has('adjustment') ? (int) $this->input('adjustment') : null;
    }

    public function reason(): ?string
    {
        $reason = $this->input('reason');

        return is_string($reason) && trim($reason) !== '' ? trim($reason) : null;
    }
}
