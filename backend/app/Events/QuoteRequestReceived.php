<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\QuoteRequest;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Entró una cotización o consulta desde el sitio público.
 */
final class QuoteRequestReceived
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public readonly QuoteRequest $quoteRequest) {}
}
