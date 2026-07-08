/**
 * Presentation · Component · PartCard
 * Tarjeta de producto estilo marketplace: foto (gradiente), descuento, precio,
 * envío, garantía y calificación. Compone atoms del sistema de diseño.
 */

"use client";

import Link from "next/link";
import { discountPercent, type MarketplacePart } from "../../domain/entities/MarketplacePart";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { RatingStars } from "@ui/atoms/RatingStars";
import { categoryIcon, categoryKey, conditionKey } from "../partPresentation";

export function PartCard({ part, index = 0 }: { part: MarketplacePart; index?: number }) {
  const { t } = useTranslation();
  const off = discountPercent(part);

  return (
    <Link href={`/autopartes/${part.id}`} className="mk-card" style={{ animationDelay: `${index * 40}ms` }}>
      <div
        className="mk-card__photo"
        style={{ background: `linear-gradient(140deg, ${part.accentFrom}, ${part.accentTo})` }}
      >
        <div className="mk-card__badges">
          <span className="tag-pill">{t(conditionKey(part.condition))}</span>
        </div>
        {off > 0 && <span className="mk-discount">-{off}% {t("market.off")}</span>}
        <span className="mk-card__icon">{categoryIcon[part.category]}</span>
      </div>

      <div className="mk-card__body">
        <span className="mk-card__cat">{t(categoryKey(part.category))}</span>
        <div className="mk-card__name">{part.name}</div>
        <RatingStars value={part.rating} reviews={part.reviews} />

        <div className="mk-card__price-row">
          <span className="mk-card__price text-gradient">{formatCurrency(part.price)}</span>
          {part.originalPrice && <span className="mk-card__old">{formatCurrency(part.originalPrice)}</span>}
        </div>

        {part.freeShipping && <span className="mk-card__ship">✓ {t("market.free")}</span>}
        {part.warrantyMonths > 0 && (
          <span className="mk-card__meta">🛡️ {t("market.warrantyShort", { n: part.warrantyMonths })}</span>
        )}

        <div className="mk-card__foot">
          <div className="mk-card__meta">{part.brand} · {part.seller}</div>
        </div>
      </div>
    </Link>
  );
}
