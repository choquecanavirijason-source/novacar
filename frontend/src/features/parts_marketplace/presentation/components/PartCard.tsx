/**
 * Presentation · Component · PartCard
 * Tarjeta de producto sobre el common @ui/ProductCard: foto (gradiente +
 * icono de categoría), descuento, precio, envío, garantía y calificación.
 */

"use client";

import { useState } from "react";
import { discountPercent, type MarketplacePart } from "../../domain/entities/MarketplacePart";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { RatingStars } from "@ui/atoms/RatingStars";
import { ProductCard } from "@ui/molecules/ProductCard";
import { categoryIcon, categoryKey, conditionKey, partPhotoUrl } from "../partPresentation";
import { ProductInquiryModal } from "./ProductInquiryModal";

export function PartCard({ part, index = 0 }: { part: MarketplacePart; index?: number }) {
  const { t, locale } = useTranslation();
  const off = discountPercent(part);
  const CategoryIcon = categoryIcon[part.category];
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const shippingFeature = part.freeShipping
    ? t("market.free")
    : part.warrantyMonths > 0
      ? t("market.warrantyShort", { n: part.warrantyMonths })
      : `${part.brand} · ${part.seller}`;

  return (
    <>
      <ProductCard
        href={`/autopartes/${part.id}`}
        onCtaClick={() => setInquiryOpen(true)}
        index={index}
        accentFrom="#252525"
        accentTo="#252525"
        photoHeight={190}
        imageUrl={partPhotoUrl(part.id, part.category)}
        imageAlt={part.name}
        photoIcon={<CategoryIcon size={48} strokeWidth={1.5} aria-hidden />}
        photoTopSlot={
          <div className="mk-card__badges">
            <span className="tag-pill">{t(conditionKey(part.condition))}</span>
          </div>
        }
        photoCornerSlot={off > 0 && <span className="mk-discount">-{off}% {t("market.off")}</span>}
        title={part.name}
        subtitle={
          <>
            <span className="mk-price-badge">{formatCurrency(part.price, locale)}</span>
            {part.originalPrice && (
              <s style={{ marginLeft: 8, color: "var(--text-muted)" }}>{formatCurrency(part.originalPrice, locale)}</s>
            )}
          </>
        }
        features={[
          t(categoryKey(part.category)),
          <RatingStars key="rating" value={part.rating} reviews={part.reviews} />,
          shippingFeature,
        ]}
        ctaLabel={t("market.viewProduct")}
      />
      {inquiryOpen && (
        <ProductInquiryModal productName={part.name} onClose={() => setInquiryOpen(false)} />
      )}
    </>
  );
}
