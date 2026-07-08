/**
 * Presentation · Component · CompatiblePartsResult
 * Lista las autopartes compatibles. Usa type guards del dominio para mostrar
 * especificaciones distintas según sea Batería o Fusible. Traducido (ES/EN).
 */

"use client";

import { isBattery, isFuse, type Part } from "../../domain/entities/Part";
import { formatAmperage, formatCurrency, formatVoltage } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";

function StockBadge({ stock }: { stock: number }) {
  const { t } = useTranslation();
  if (stock <= 0) return <span className="badge badge--out">{t("finder.stockOut")}</span>;
  if (stock < 5) return <span className="badge badge--low">{t("finder.stockLow", { n: stock })}</span>;
  return <span className="badge badge--in">{t("finder.stockIn")}</span>;
}

function PartSpec({ part }: { part: Part }) {
  const { t } = useTranslation();
  if (isBattery(part)) {
    return (
      <span className="part-card__meta">
        {part.group} · {formatAmperage(part.amperage)} CCA · {formatVoltage(part.voltage)} · {part.brand}
      </span>
    );
  }
  if (isFuse(part)) {
    return (
      <span className="part-card__meta">
        {t("finder.fuseType", { type: part.type })} · {formatAmperage(part.amperage)} · {part.brand}
      </span>
    );
  }
  return null;
}

export function CompatiblePartsResult({ parts, emptyLabel }: { parts: Part[]; emptyLabel: string }) {
  if (parts.length === 0) {
    return <p className="empty">{emptyLabel}</p>;
  }

  return (
    <div className="results" aria-live="polite">
      {parts.map((part) => (
        <article key={part.id} className="part-card">
          <div>
            <div className="part-card__name">{part.name}</div>
            <PartSpec part={part} />
            <div style={{ marginTop: 8 }}>
              <StockBadge stock={part.stock} />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="part-card__price">{formatCurrency(part.price)}</div>
            <div className="part-card__meta">SKU {part.sku}</div>
          </div>
        </article>
      ))}
    </div>
  );
}
