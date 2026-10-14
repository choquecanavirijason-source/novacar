<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\QuoteStatus;
use Illuminate\Validation\Rule;

/**
 * Cambio de estado de una cotización desde la bandeja
 * (`PATCH /api/admin/quote-requests/{quoteRequest}/status`).
 */
class UpdateQuoteRequestStatusRequest extends StaffRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(QuoteStatus::class)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Indica el nuevo estado de la cotización.',
            'status.enum' => 'El estado enviado no es válido.',
        ];
    }

    public function status(): QuoteStatus
    {
        return QuoteStatus::from((string) $this->validated('status'));
    }
}
