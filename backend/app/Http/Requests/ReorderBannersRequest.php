<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Banner;
use Illuminate\Validation\Rule;

/**
 * Reordenamiento por flechas (`PATCH /api/admin/banners/reorder`).
 *
 * Recibe la lista completa de ids en el orden deseado; el servicio reasigna las
 * posiciones 0..n dentro de una transacción.
 */
class ReorderBannersRequest extends StaffRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'ordered_ids' => ['required', 'array', 'min:1', 'max:200'],
            'ordered_ids.*' => [
                'required',
                'string',
                'distinct',
                Rule::exists(Banner::class, 'id')->whereNull('deleted_at'),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ordered_ids.required' => 'Envía la lista de banners en el orden deseado.',
            'ordered_ids.*.distinct' => 'La lista de orden no puede repetir el mismo banner.',
            'ordered_ids.*.exists' => 'Uno de los banners enviados ya no existe.',
        ];
    }

    /**
     * @return list<string>
     */
    public function orderedIds(): array
    {
        /** @var list<string> $ids */
        $ids = $this->validated('ordered_ids');

        return $ids;
    }
}
