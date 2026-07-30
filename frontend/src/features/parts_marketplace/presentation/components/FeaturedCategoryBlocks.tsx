/**
 * Presentation · Component · FeaturedCategoryBlocks
 * Hero de Autopartes: grid de "Soft Cards" (gris, radios asimétricos,
 * sombra amplia/difusa de baja opacidad) donde la foto real del producto
 * (cut-out) se posiciona rompiendo la esquina de su tarjeta. Cada bloque
 * filtra el marketplace por esa categoría y hace scroll al grid de productos.
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@core/i18n/I18nProvider";
import { usePartsMarketplaceStore } from "../store/usePartsMarketplaceStore";
import { categoryIcon, categoryKey, partPhotoUrl } from "../partPresentation";
import type { PartCategory } from "../../domain/entities/MarketplacePart";

const BLOCKS: PartCategory[] = ["engine", "tires", "battery", "oil", "audio"];

export function FeaturedCategoryBlocks() {
  const { t } = useTranslation();
  const apply = usePartsMarketplaceStore((s) => s.apply);
  const [failed, setFailed] = useState<Partial<Record<PartCategory, boolean>>>({});

  const selectCategory = (category: PartCategory) => {
    void apply({ categories: [category] });
    document.getElementById("mk-product-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="mk-hero-grid">
      {BLOCKS.map((category, i) => {
        const Icon = categoryIcon[category];
        return (
          <button
            key={category}
            type="button"
            onClick={() => selectCategory(category)}
            className={`mk-hero-card ${i % 2 === 1 ? "mk-hero-card--alt" : ""}`}
          >
            <Icon size={0} strokeWidth={1.25} className="text-(--accent-neon)" aria-hidden />
            <Image
              className="mk-hero-card__photo"
              src={failed[category] ? partPhotoUrl(category, category, { w: 300, h: 300 }) : `/parts/${category}.png`}
              alt=""
              width={250}
              height={250}
              unoptimized={Boolean(failed[category])}
              loading="lazy"
              onError={() => setFailed((prev) => ({ ...prev, [category]: true }))}
            />

            <h3 className="mk-hero-card__title">{t(categoryKey(category))}</h3>
            <p className="mk-hero-card__subtitle">{t("market.blockSubtitle")}</p>
            <span className="mk-hero-card__cta">{t("market.shopNow")} →</span>
          </button>
        );
      })}
    </section>
  );
}
