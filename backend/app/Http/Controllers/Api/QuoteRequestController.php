<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\DataTransferObjects\QuoteRequestData;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuoteRequestRequest;
use App\Http\Resources\QuoteRequestResource;
use App\Services\QuoteRequestService;
use Illuminate\Http\JsonResponse;

/**
 * Entrada pública de cotizaciones y consultas.
 *
 * Único endpoint de escritura sin sesión: la ruta va con throttle y el
 * FormRequest acota cada campo.
 */
final class QuoteRequestController extends Controller
{
    public function __construct(private readonly QuoteRequestService $quoteRequests) {}

    /** POST /api/quote-requests */
    public function store(StoreQuoteRequestRequest $request): JsonResponse
    {
        $quoteRequest = $this->quoteRequests->create(QuoteRequestData::fromRequest($request));

        return (new QuoteRequestResource($quoteRequest))
            ->response()
            ->setStatusCode(JsonResponse::HTTP_CREATED);
    }
}
