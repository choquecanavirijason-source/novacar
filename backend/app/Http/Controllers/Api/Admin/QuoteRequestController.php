<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Enums\QuoteSource;
use App\Enums\QuoteStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateQuoteRequestStatusRequest;
use App\Http\Resources\QuoteRequestResource;
use App\Services\QuoteRequestService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

/**
 * Bandeja de cotizaciones del panel (`/api/admin/quote-requests`).
 */
final class QuoteRequestController extends Controller
{
    public function __construct(private readonly QuoteRequestService $quoteRequests) {}

    /** GET /api/admin/quote-requests?status=new&source=import */
    public function index(Request $request): AnonymousResourceCollection
    {
        return QuoteRequestResource::collection(
            $this->quoteRequests->list(
                QuoteStatus::tryFrom((string) $request->query('status', '')),
                QuoteSource::tryFrom((string) $request->query('source', '')),
            )
        );
    }

    /** PATCH /api/admin/quote-requests/{quoteRequest}/status */
    public function updateStatus(
        UpdateQuoteRequestStatusRequest $request,
        string $quoteRequest,
    ): QuoteRequestResource {
        return new QuoteRequestResource(
            $this->quoteRequests->changeStatus($quoteRequest, $request->status(), $request->user())
        );
    }

    /** DELETE /api/admin/quote-requests/{quoteRequest} */
    public function destroy(string $quoteRequest): Response
    {
        $this->quoteRequests->delete($quoteRequest);

        return response()->noContent();
    }
}
