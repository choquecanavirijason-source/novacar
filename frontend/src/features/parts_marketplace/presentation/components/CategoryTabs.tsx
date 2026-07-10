/**
 * Presentation · Component · CategoryTabs
 * Carrusel único (con flechas) que fusiona los tabs de modo (Destacados /
 * Nuevos / Más Vendidos) con los tabs de categoría (Todos + cada categoría).
 * Selección de categoría única (a diferencia del sidebar multi-select);
 * sincroniza con el filtro del store compartido.
 */

"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePartsMarketplaceStore } from "../store/usePartsMarketplaceStore";
import { useTranslation } from "@core/i18n/I18nProvider";
import { categoryIcon, categoryKey } from "../partPresentation";
import type { PartCategory } from "../../domain/entities/MarketplacePart";

export function CategoryTabs() {
  const { t } = useTranslation();
  const { facets, filters, apply } = usePartsMarketplaceStore();
  const trackRef = useRef<HTMLDivElement>(null);

  if (!facets) return null;

  // Modo (sort/condición) — fusionado en el mismo carrusel que la categoría.
  const isFeaturedMode = filters.sort === "relevance" && filters.conditions.length === 0;
  const isNewMode = filters.conditions.length === 1 && filters.conditions[0] === "nuevo";
  const isBestSellerMode = filters.sort === "rating";

  // Categoría: activa cuando hay exactamente 1 seleccionada (modo tab).
  const single = filters.categories.length === 1 ? filters.categories[0] : null;
  const isAll = filters.categories.length === 0;

  const selectCategory = (cat: PartCategory | null) => void apply({ categories: cat ? [cat] : [] });
  const scrollByAmount = (delta: number) => trackRef.current?.scrollBy({ left: delta, behavior: "smooth" });

  return (
    <div className="mk-carousel">
      <button
        type="button"
        className="mk-carousel__arrow"
        onClick={() => scrollByAmount(-240)}
        aria-label="Scroll left"
      >
        <ChevronLeft size={18} strokeWidth={2} aria-hidden />
      </button>

      <div className="mk-tabs" role="tablist" aria-label={t("market.category")} ref={trackRef}>
        <button
          type="button"
          role="tab"
          aria-selected={isFeaturedMode}
          className={`mk-tab ${isFeaturedMode ? "mk-tab--active" : ""}`}
          onClick={() => void apply({ sort: "relevance", conditions: [] })}
        >
          {t("market.tabFeatured")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isNewMode}
          className={`mk-tab ${isNewMode ? "mk-tab--active" : ""}`}
          onClick={() => void apply({ conditions: ["nuevo"] })}
        >
          {t("market.tabNew")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isBestSellerMode}
          className={`mk-tab ${isBestSellerMode ? "mk-tab--active" : ""}`}
          onClick={() => void apply({ sort: "rating" })}
        >
          {t("market.tabBestSellers")}
        </button>

        <span className="mk-tabs__divider" aria-hidden />

        <button
          type="button"
          role="tab"
          aria-selected={isAll}
          className={`mk-tab ${isAll ? "mk-tab--active" : ""}`}
          onClick={() => selectCategory(null)}
        >
          {t("market.all")}
        </button>
        {facets.categories.map((c) => {
          const CategoryIcon = categoryIcon[c.value];
          return (
            <button
              key={c.value}
              type="button"
              role="tab"
              aria-selected={single === c.value}
              className={`mk-tab ${single === c.value ? "mk-tab--active" : ""}`}
              onClick={() => selectCategory(c.value)}
            >
              <CategoryIcon size={15} strokeWidth={1.75} aria-hidden />
              {t(categoryKey(c.value))}
              <span className="mk-tab__count">{c.count}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="mk-carousel__arrow"
        onClick={() => scrollByAmount(240)}
        aria-label="Scroll right"
      >
        <ChevronRight size={18} strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
