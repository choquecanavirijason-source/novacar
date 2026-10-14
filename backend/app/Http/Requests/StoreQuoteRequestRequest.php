<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\QuoteSource;
use App\Models\CatalogVehicle;
use App\Models\MarketplacePart;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

/**
 * Formulario público de cotización/consulta (`POST /api/quote-requests`).
 *
 * Es el único endpoint de escritura abierto a visitantes anónimos: por eso la
 * autorización es libre pero la ruta va detrás de un throttle estricto y aquí
 * se acota con firmeza cada campo.
 */
class StoreQuoteRequestRequest extends FormRequest
{
    /** Endpoint público: cualquier visitante puede enviar una solicitud. */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('customer_email'))) {
            $this->merge([
                'customer_email' => mb_strtolower(trim($this->string('customer_email')->toString())),
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'source' => ['required', Rule::enum(QuoteSource::class)],
            'customer_email' => ['required', 'string', 'email:rfc', 'max:180'],
            'subject' => ['required', 'string', 'max:180'],
            'details' => ['required', 'string', 'max:4000'],
            'amount' => ['nullable', 'integer', 'min:0', 'max:99999999'],

            // Referencias opcionales al recurso de origen; si vienen, deben existir.
            'vehicle_id' => [
                'nullable', 'string', 'max:120',
                Rule::exists(CatalogVehicle::class, 'id')->whereNull('deleted_at'),
            ],
            'part_id' => [
                'nullable', 'string', 'max:120',
                Rule::exists(MarketplacePart::class, 'id')->whereNull('deleted_at'),
            ],
        ];
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

                $source = QuoteSource::tryFrom((string) $this->input('source'));

                if ($source?->requiresAmount() && $this->input('amount') === null) {
                    $validator->errors()->add(
                        'amount',
                        'Una cotización de importación debe incluir el monto estimado.',
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
            'source.required' => 'No se pudo identificar el origen de la solicitud.',
            'customer_email.required' => 'Necesitamos tu correo para responderte.',
            'customer_email.email' => 'El correo no tiene un formato válido.',
            'subject.required' => 'Indica el asunto de tu solicitud.',
            'details.required' => 'Cuéntanos brevemente qué necesitas.',
            'details.max' => 'El detalle no puede superar los 4 000 caracteres.',
            'vehicle_id.exists' => 'El vehículo de la solicitud ya no está disponible.',
            'part_id.exists' => 'La autoparte de la solicitud ya no está disponible.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'source' => 'origen',
            'customer_email' => 'correo',
            'subject' => 'asunto',
            'details' => 'detalle',
            'amount' => 'monto',
            'vehicle_id' => 'vehículo',
            'part_id' => 'autoparte',
        ];
    }
}
