<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QuoteRequestController extends Controller
{
    private const SOURCES = ['import', 'inquiry', 'test_drive'];

    private const STATUSES = ['new', 'contacted', 'closed'];

    /** Público: el sitio envía una cotización/consulta (importación o autoparte). */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'source' => ['required', 'string', 'in:' . implode(',', self::SOURCES)],
            'customer_email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'details' => ['required', 'string', 'max:5000'],
            'amount' => ['nullable', 'integer', 'min:0'],
        ]);

        $quote = QuoteRequest::create([
            'id' => (string) Str::uuid(),
            'source' => $data['source'],
            'customer_email' => $data['customer_email'],
            'subject' => $data['subject'],
            'details' => $data['details'],
            'amount' => $data['amount'] ?? null,
            'status' => 'new',
        ]);

        return response()->json($this->payload($quote), 201);
    }

    /** Admin/operator: bandeja de cotizaciones. */
    public function adminIndex(): JsonResponse
    {
        return response()->json(
            QuoteRequest::query()->orderByDesc('created_at')->get()
                ->map(fn (QuoteRequest $q) => $this->payload($q))
        );
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:' . implode(',', self::STATUSES)],
        ]);

        $quote = QuoteRequest::find($id);
        if (! $quote) {
            return response()->json(['message' => 'Cotización no encontrada.'], 404);
        }

        $quote->update(['status' => $data['status']]);

        return response()->json($this->payload($quote->fresh()));
    }

    public function destroy(string $id): JsonResponse
    {
        $quote = QuoteRequest::find($id);
        if (! $quote) {
            return response()->json(['message' => 'Cotización no encontrada.'], 404);
        }

        $quote->delete();

        return response()->json(null, 204);
    }

    private function payload(QuoteRequest $q): array
    {
        return [
            'id' => $q->id,
            'source' => $q->source,
            'customer_email' => $q->customer_email,
            'subject' => $q->subject,
            'details' => $q->details,
            'amount' => $q->amount,
            'status' => $q->status,
            'created_at' => $q->created_at?->toISOString(),
        ];
    }
}
