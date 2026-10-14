<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\QuoteRequestReceived;
use App\Jobs\NotifyStaffOfQuoteRequest;

/**
 * Traduce el evento de dominio en el job que avisa al personal.
 *
 * El servicio dispara el evento y no sabe nada del canal de notificación:
 * cambiar de log a correo no toca la capa de negocio.
 */
final class DispatchQuoteRequestNotification
{
    public function handle(QuoteRequestReceived $event): void
    {
        NotifyStaffOfQuoteRequest::dispatch($event->quoteRequest->id);
    }
}
