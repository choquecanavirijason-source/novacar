<?php

declare(strict_types=1);

namespace App\DataTransferObjects;

use App\Enums\QuoteSource;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Solicitud entrante desde uno de los tres formularios públicos.
 *
 * `status` y `created_at` no viajan: los fija el servicio (toda solicitud nace
 * en estado `new`), para que el cliente no pueda auto-asignarse un estado.
 */
final readonly class QuoteRequestData
{
    public function __construct(
        public QuoteSource $source,
        public string $customerEmail,
        public string $subject,
        public string $details,
        public ?int $amount,
        public ?string $vehicleId = null,
        public ?string $partId = null,
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return self::fromArray($request->validated());
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        $amount = $data['amount'] ?? null;

        return new self(
            source: QuoteSource::from((string) $data['source']),
            customerEmail: mb_strtolower(trim((string) $data['customer_email'])),
            subject: trim((string) $data['subject']),
            details: trim((string) ($data['details'] ?? '')),
            amount: $amount === null ? null : max(0, (int) $amount),
            vehicleId: self::nullableString($data['vehicle_id'] ?? null),
            partId: self::nullableString($data['part_id'] ?? null),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'source' => $this->source,
            'customer_email' => $this->customerEmail,
            'subject' => $this->subject,
            'details' => $this->details,
            'amount' => $this->amount,
            'vehicle_id' => $this->vehicleId,
            'part_id' => $this->partId,
        ];
    }

    private static function nullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $text = trim((string) $value);

        return $text === '' ? null : $text;
    }
}
