/**
 * Presentation · Component · CompatiblePartsResult
 * Lista las autopartes reales compatibles, reutilizando la misma tarjeta
 * (`PartCard`) que el marketplace de autopartes — mismo look, mismos datos,
 * mismo destino (`/autopartes/[id]`).
 */

"use client";

import { PartCard, type MarketplacePart } from "@features/parts_marketplace";
import "@features/parts_marketplace/presentation/styles/marketplace.css";

export function CompatiblePartsResult({ parts, emptyLabel }: { parts: MarketplacePart[]; emptyLabel: string }) {
  if (parts.length === 0) {
    return <p className="empty">{emptyLabel}</p>;
  }

  return (
    <div className="mk-grid" aria-live="polite">
      {parts.map((part, i) => (
        <PartCard key={part.id} part={part} index={i} />
      ))}
    </div>
  );
}
