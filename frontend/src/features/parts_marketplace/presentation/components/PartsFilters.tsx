/**
 * Presentation · Component · PartsFilters
 * Sidebar de filtros largo del marketplace: categoría, marca, estado, precio,
 * compatibilidad (auto + año), envío, garantía, disponibilidad y calificación.
 */

"use client";

import { usePartsMarketplaceStore } from "../store/usePartsMarketplaceStore";
import { useTranslation } from "@core/i18n/I18nProvider";
import { categoryIcon, categoryKey, conditionKey } from "../partPresentation";
import { Input } from "@ui/atoms/Input";

function Toggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" className="mk-toggle" onClick={onClick} aria-pressed={on}>
      <span>{label}</span>
      <span className={`mk-switch ${on ? "mk-switch--on" : ""}`} aria-hidden />
    </button>
  );
}

export function PartsFilters() {
  const { t } = useTranslation();
  const { facets, filters, toggleCategory, toggleBrand, toggleCondition, apply, clear, activeCount } =
    usePartsMarketplaceStore();

  if (!facets) return <div className="card mk-filters skeleton" style={{ height: 480 }} />;

  const active = activeCount();

  return (
    <aside className="card mk-filters">
      <div className="mk-filters__head">
        <strong>{t("market.filters")}{active > 0 && ` (${active})`}</strong>
        {active > 0 && (
          <button
            type="button"
            onClick={() => void clear()}
            style={{ background: "none", color: "var(--accent-neon)", fontSize: "0.8rem", fontWeight: 700 }}
          >
            {t("market.clear")}
          </button>
        )}
      </div>

      {/* Categoría */}
      <div className="mk-group">
        <div className="mk-group__title">{t("market.category")}</div>
        {facets.categories.map((c) => {
          const on = filters.categories.includes(c.value);
          const CategoryIcon = categoryIcon[c.value];
          return (
            <button
              key={c.value}
              type="button"
              className={`mk-check ${on ? "mk-check--active" : ""}`}
              onClick={() => void toggleCategory(c.value)}
              aria-pressed={on}
            >
              <span className="mk-check__box">{on ? "✓" : ""}</span>
              <span className="mk-check__icon">
                <CategoryIcon size={16} strokeWidth={1.75} aria-hidden />
              </span>
              <span>{t(categoryKey(c.value))}</span>
              <span className="mk-check__count">{c.count}</span>
            </button>
          );
        })}
      </div>

      {/* Estado / condición */}
      <div className="mk-group">
        <div className="mk-group__title">{t("market.condition")}</div>
        {facets.conditions.map((cond) => {
          const on = filters.conditions.includes(cond);
          return (
            <button
              key={cond}
              type="button"
              className={`mk-check ${on ? "mk-check--active" : ""}`}
              onClick={() => void toggleCondition(cond)}
              aria-pressed={on}
            >
              <span className="mk-check__box">{on ? "✓" : ""}</span>
              <span>{t(conditionKey(cond))}</span>
            </button>
          );
        })}
      </div>

      {/* Precio */}
      <div className="mk-group">
        <div className="mk-group__title">
          {t("market.price")} ({facets.priceRange.min.toLocaleString("es-MX")}–
          {facets.priceRange.max.toLocaleString("es-MX")})
        </div>
        <div className="mk-price">
          <Input
            type="number"
            placeholder="Mín"
            aria-label="min"
            value={filters.minPrice ?? ""}
            onChange={(e) => void apply({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
          <Input
            type="number"
            placeholder="Máx"
            aria-label="max"
            value={filters.maxPrice ?? ""}
            onChange={(e) => void apply({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>
      </div>

      {/* Marca de la pieza */}
      <div className="mk-group">
        <div className="mk-group__title">{t("market.brand")}</div>
        {facets.brands.map((b) => {
          const on = filters.brands.includes(b);
          return (
            <button
              key={b}
              type="button"
              className={`mk-check ${on ? "mk-check--active" : ""}`}
              onClick={() => void toggleBrand(b)}
              aria-pressed={on}
            >
              <span className="mk-check__box">{on ? "✓" : ""}</span>
              <span>{b}</span>
            </button>
          );
        })}
      </div>

      {/* Compatibilidad de vehículo */}
      <div className="mk-group">
        <div className="mk-group__title">{t("market.compatibility")}</div>
        <select
          className="mk-select"
          value={filters.vehicleBrand ?? ""}
          onChange={(e) => void apply({ vehicleBrand: e.target.value || undefined })}
          aria-label={t("market.vehicleBrand")}
          style={{ marginBottom: 10 }}
        >
          <option value="">{t("market.vehicleBrand")}</option>
          {facets.vehicleBrands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          className="mk-select"
          value={filters.year ?? ""}
          onChange={(e) => void apply({ year: e.target.value ? Number(e.target.value) : undefined })}
          aria-label={t("market.year")}
        >
          <option value="">{t("market.year")}: {t("market.allYears")}</option>
          {facets.years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Calificación mínima */}
      <div className="mk-group">
        <div className="mk-group__title">{t("market.rating")}</div>
        <select
          className="mk-select"
          value={filters.minRating ?? ""}
          onChange={(e) => void apply({ minRating: e.target.value ? Number(e.target.value) : undefined })}
          aria-label={t("market.rating")}
        >
          <option value="">{t("market.ratingAny")}</option>
          {[4.5, 4, 3.5, 3].map((r) => (
            <option key={r} value={r}>{t("market.ratingMin", { n: r })}</option>
          ))}
        </select>
      </div>

      {/* Toggles */}
      <div className="mk-group">
        <Toggle on={!!filters.freeShipping} label={`🚚 ${t("market.shipping")}`} onClick={() => void apply({ freeShipping: !filters.freeShipping || undefined })} />
        <Toggle on={!!filters.withWarranty} label={`🛡️ ${t("market.warranty")}`} onClick={() => void apply({ withWarranty: !filters.withWarranty || undefined })} />
        <Toggle on={!!filters.inStock} label={`📦 ${t("market.inStock")}`} onClick={() => void apply({ inStock: !filters.inStock || undefined })} />
      </div>
    </aside>
  );
}
