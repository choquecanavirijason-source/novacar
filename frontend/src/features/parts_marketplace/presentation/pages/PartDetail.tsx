/**
 * Presentation · Component · PartDetail (client)
 * Página de detalle de una autoparte del marketplace.
 */

"use client";

import Link from "next/link";
import { discountPercent, type MarketplacePart } from "../../domain/entities/MarketplacePart";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import { Badge } from "@ui/atoms/Badge";
import { RatingStars } from "@ui/atoms/RatingStars";
import { categoryIcon, categoryKey, conditionKey } from "../partPresentation";
import "../styles/marketplace.css";

export function PartDetail({ part }: { part: MarketplacePart }) {
  const { t } = useTranslation();
  const off = discountPercent(part);

  return (
    <section style={{ paddingTop: 24 }}>
      <Link href="/autopartes" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
        ← {t("market.back")}
      </Link>

      <div className="mk-detail">
        <div
          className="mk-detail__photo"
          style={{ background: `linear-gradient(140deg, ${part.accentFrom}, ${part.accentTo})` }}
        >
          <span className="mk-card__icon">{categoryIcon[part.category]}</span>
        </div>

        <div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <Badge tone="neon">{t(categoryKey(part.category))}</Badge>
            <Badge tone={part.condition === "nuevo" ? "in" : "low"}>{t(conditionKey(part.condition))}</Badge>
            {part.stock <= 0 && <Badge tone="out">{t("finder.stockOut")}</Badge>}
          </div>

          <h1 style={{ fontSize: "1.9rem", fontWeight: 900, lineHeight: 1.2 }}>{part.name}</h1>
          <div style={{ margin: "10px 0" }}>
            <RatingStars value={part.rating} reviews={part.reviews} size="0.95rem" />
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "12px 0" }}>
            <span className="text-gradient" style={{ fontSize: "2.4rem", fontWeight: 900 }}>
              {formatCurrency(part.price)}
            </span>
            {part.originalPrice && (
              <>
                <span className="mk-card__old" style={{ fontSize: "1rem" }}>{formatCurrency(part.originalPrice)}</span>
                {off > 0 && <span className="mk-discount" style={{ position: "static" }}>-{off}%</span>}
              </>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {part.freeShipping && <span className="mk-card__ship">🚚 {t("market.free")}</span>}
            {part.warrantyMonths > 0 && (
              <span className="mk-card__meta">🛡️ {t("market.warrantyShort", { n: part.warrantyMonths })}</span>
            )}
            <span className="mk-card__meta">{t("market.seller")}: {part.seller} · {part.brand} · SKU {part.sku}</span>
          </div>

          {part.specs.length > 0 && (
            <>
              <h3 style={{ fontWeight: 700, margin: "8px 0 8px" }}>{t("market.specs")}</h3>
              <div className="mk-specs">
                {part.specs.map((s) => (
                  <div key={s.label} className="mk-spec-row">
                    <span>{s.label}</span>
                    <span>{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3 style={{ fontWeight: 700, margin: "12px 0 8px" }}>{t("market.compatTitle")}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
            {part.compatibleBrands.map((b) => (
              <span key={b} className="spec-badge">{b}</span>
            ))}
            <span className="spec-badge">{part.yearFrom}–{part.yearTo}</span>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button>{t("market.buyNow")}</Button>
            <Button variant="ghost">🛒 {t("market.addCart")}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
