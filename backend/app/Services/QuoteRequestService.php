<?php

declare(strict_types=1);

namespace App\Services;

use App\DataTransferObjects\QuoteRequestData;
use App\Enums\QuoteSource;
use App\Enums\QuoteStatus;
use App\Events\QuoteRequestReceived;
use App\Exceptions\BusinessRuleViolationException;
use App\Exceptions\ResourceNotFoundException;
use App\Models\QuoteRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Bandeja de cotizaciones y consultas.
 *
 * Toda solicitud nace en estado `new` sin importar lo que mande el cliente, y
 * los cambios de estado respetan la máquina definida en QuoteStatus.
 */
final class QuoteRequestService
{
    /**
     * Bandeja del panel, con filtros opcionales por estado y origen.
     *
     * @return Collection<int, QuoteRequest>
     */
    public function list(?QuoteStatus $status = null, ?QuoteSource $source = null): Collection
    {
        return QuoteRequest::query()
            ->ofStatus($status)
            ->ofSource($source)
            ->with(['handler'])
            ->latestFirst()
            ->get();
    }

    public function findOrFail(string $id): QuoteRequest
    {
        $quoteRequest = QuoteRequest::query()->find($id);

        if ($quoteRequest === null) {
            throw ResourceNotFoundException::quoteRequest($id);
        }

        return $quoteRequest;
    }

    /**
     * Registra una solicitud entrante del sitio público.
     *
     * @throws BusinessRuleViolationException
     */
    public function create(QuoteRequestData $data): QuoteRequest
    {
        if ($data->source->requiresAmount() && $data->amount === null) {
            throw new BusinessRuleViolationException(
                'Una cotización de importación debe incluir el monto estimado.',
                'missing_quote_amount',
                ['source' => $data->source->value],
            );
        }

        $quoteRequest = DB::transaction(static fn (): QuoteRequest => QuoteRequest::query()->create([
            ...$data->toArray(),
            // El estado nunca llega desde el request: lo fija el negocio.
            'status' => QuoteStatus::New,
        ]));

        QuoteRequestReceived::dispatch($quoteRequest);

        return $quoteRequest;
    }

    /**
     * Mueve la solicitud de estado y deja trazabilidad de quién la atendió.
     *
     * @throws ResourceNotFoundException|BusinessRuleViolationException
     */
    public function changeStatus(string $id, QuoteStatus $status, ?User $handler = null): QuoteRequest
    {
        $quoteRequest = $this->findOrFail($id);

        if (! $quoteRequest->status->canTransitionTo($status)) {
            throw BusinessRuleViolationException::invalidStatusTransition(
                $quoteRequest->status->value,
                $status->value,
            );
        }

        if ($quoteRequest->status === $status) {
            return $quoteRequest;
        }

        DB::transaction(static function () use ($quoteRequest, $status, $handler): void {
            $quoteRequest->status = $status;
            $quoteRequest->handled_by = $handler?->id ?? $quoteRequest->handled_by;
            $quoteRequest->handled_at = $status === QuoteStatus::New ? null : now();
            $quoteRequest->save();
        });

        return $quoteRequest->refresh();
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function delete(string $id): void
    {
        $quoteRequest = $this->findOrFail($id);

        DB::transaction(static function () use ($quoteRequest): void {
            $quoteRequest->delete();
        });
    }

    /**
     * Resumen para el tablero: cuántas hay por estado y cuántas siguen sin atender.
     *
     * @return array{total: int, pending: int, by_status: array<string, int>, by_source: array<string, int>}
     */
    public function summary(): array
    {
        $byStatus = QuoteRequest::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->all();

        $bySource = QuoteRequest::query()
            ->selectRaw('source, COUNT(*) as total')
            ->groupBy('source')
            ->pluck('total', 'source')
            ->all();

        return [
            'total' => (int) array_sum($byStatus),
            'pending' => (int) ($byStatus[QuoteStatus::New->value] ?? 0),
            'by_status' => array_map(intval(...), $byStatus),
            'by_source' => array_map(intval(...), $bySource),
        ];
    }
}
