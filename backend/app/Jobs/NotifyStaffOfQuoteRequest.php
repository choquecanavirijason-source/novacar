<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\QuoteRequest;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

/**
 * Avisa al personal de que entró una cotización nueva.
 *
 * Se ejecuta en cola para que el visitante reciba su 201 sin esperar al envío.
 * Hoy deja el aviso en el log (canal por defecto del proyecto); el punto de
 * extensión para correo o webhook es el método `handle()`.
 */
final class NotifyStaffOfQuoteRequest implements ShouldQueue
{
    use Queueable;

    /** Reintentos ante fallos transitorios del transporte. */
    public int $tries = 3;

    /** Espera creciente entre reintentos (segundos). */
    public array $backoff = [10, 60, 180];

    public function __construct(private readonly string $quoteRequestId) {}

    public function handle(): void
    {
        $quoteRequest = QuoteRequest::find($this->quoteRequestId);

        if ($quoteRequest === null) {
            // La solicitud se borró antes de procesar la cola: nada que avisar.
            return;
        }

        $recipients = User::query()->staff()->pluck('email')->all();

        Log::channel(config('logging.default'))->info('Nueva cotización recibida', [
            'quote_request_id' => $quoteRequest->id,
            'source' => $quoteRequest->source->value,
            'subject' => $quoteRequest->subject,
            'customer_email' => $quoteRequest->customer_email,
            'amount' => $quoteRequest->amount,
            'notified' => $recipients,
        ]);
    }

    /**
     * Etiquetas visibles en Horizon / `queue:monitor`.
     *
     * @return list<string>
     */
    public function tags(): array
    {
        return ['quote-request', "quote:{$this->quoteRequestId}"];
    }
}
