/**
 * Presentation · Component · CategoryTabs (estilo Brator "Featured Product")
 * Tabs horizontales de categoría: Todos + cada categoría. Selección única
 * (a diferencia del sidebar multi-select); sincroniza con el filtro de categoría.
 */

"use client";

import { usePartsMarketplaceStore } from "../store/usePartsMarketplaceStore";
import { useTranslation } from "@core/i18n/I18nProvider";
import { categoryIcon, categoryKey } from "../partPresentation";
import type { PartCategory } from "../../domain/entities/MarketplacePart";

export function CategoryTabs() {
  const { t } = useTranslation();
  const { facets, filters, apply } = usePartsMarketplaceStore();
  if (!facets) return null;

  // Activo cuando hay exactamente 1 categoría seleccionada (modo tab).
  const single = filters.categories.length === 1 ? filters.categories[0] : null;
  const isAll = filters.categories.length === 0;

  const select = (cat: PartCategory | null) =>
    void apply({ categories: cat ? [cat] : [] });

  return (
    <div className="mk-tabs" role="tablist" aria-label={t("market.category")}>
      <button
        type="button"
        role="tab"
        aria-selected={isAll}
        className={`mk-tab ${isAll ? "mk-tab--active" : ""}`}
        onClick={() => select(null)}
      >
        {t("market.all")}
      </button>
      {facets.categories.map((c) => (
        <button
          key={c.value}
          type="button"
          role="tab"
          aria-selected={single === c.value}
          className={`mk-tab ${single === c.value ? "mk-tab--active" : ""}`}
          onClick={() => select(c.value)}
        >
          <span aria-hidden>{categoryIcon[c.value]}</span>
          {t(categoryKey(c.value))}
          <span className="mk-tab__count">{c.count}</span>
        </button>
      ))}
    </div>
  );
}
