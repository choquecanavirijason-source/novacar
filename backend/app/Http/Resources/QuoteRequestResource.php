<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\QuoteRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Espejo de `QuoteRequestDTO`. Las fechas viajan en ISO-8601 porque el panel
 * las formatea con `toLocaleString` del navegador.
 *
 * @mixin QuoteRequest
 */
class QuoteRequestResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'source' => $this->source->value,
            'customer_email' => $this->customer_email,
            'subject' => $this->subject,
            'details' => $this->details,
            'amount' => $this->amount,
            'status' => $this->status->value,
            'created_at' => $this->created_at?->toIso8601String(),

            'handled_at' => $this->handled_at?->toIso8601String(),
            'handled_by' => new UserResource($this->whenLoaded('handler')),
            'vehicle' => new CatalogVehicleResource($this->whenLoaded('vehicle')),
            'part' => new MarketplacePartResource($this->whenLoaded('part')),
        ];
    }
}
