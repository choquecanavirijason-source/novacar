/**
 * Presentation · Component · CatalogFilters
 * Panel de filtros reactivo, traducido. Consume el store del catálogo y atoms.
 */

"use client";

import { useState } from "react";
import { useCatalogStore } from "../store/useCatalogStore";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { bodyTypeKey, fuelKey } from "../vehiclePresentation";

export function CatalogFilters() {
  const { t } = useTranslation();
  const { options, filters, setFilter, clearFilters } = useCatalogStore();
  const [open, setOpen] = useState(false);

  if (!options) return <div className="card catalog-filter-dropdown catalog-filter-dropdown--loading" />;

  const hasFilters = Object.values(filters).some((v) => v !== undefined);
  const activeCount = [filters.brand, filters.bodyType, filters.fuelType, filters.maxPrice].filter(Boolean).length;

  return (
    <div className="catalog-filter-dropdown">
      <button type="button" className="catalog-filter-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>{t("catalog.filters")}</span>
        {hasFilters && <span className="catalog-filter-badge">{activeCount}</span>}
      </button>

      {open && (
        <div className="catalog-filter-panel">
          <div className="catalog-filter-panel__actions">
            <strong>{t("catalog.filters")}</strong>
            {hasFilters && (
              <button type="button" className="catalog-filter-clear" onClick={() => void clearFilters()}>
                {t("common.clear")}
              </button>
            )}
          </div>

          <div className="catalog-filter-panel__row">
            <label className="catalog-filter-panel__label" htmlFor="catalog-brand-select">
              {t("catalog.brand")}
            </label>
            <select
              id="catalog-brand-select"
              className="catalog-filter-select"
              value={filters.brand ?? ""}
              onChange={(e) => void setFilter("brand", e.target.value || undefined)}
            >
              <option value="">{t("catalog.brand")}</option>
              {options.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="catalog-filter-panel__row">
            <label className="catalog-filter-panel__label" htmlFor="catalog-body-select">
              {t("catalog.body")}
            </label>
            <select
              id="catalog-body-select"
              className="catalog-filter-select"
              value={filters.bodyType ?? ""}
              onChange={(e) => void setFilter("bodyType", (e.target.value || undefined) as typeof filters.bodyType)}
            >
              <option value="">{t("catalog.body")}</option>
              {options.bodyTypes.map((body) => (
                <option key={body} value={body}>
                  {t(bodyTypeKey[body])}
                </option>
              ))}
            </select>
          </div>

          <div className="catalog-filter-panel__row">
            <label className="catalog-filter-panel__label" htmlFor="catalog-fuel-select">
              {t("catalog.fuel")}
            </label>
            <select
              id="catalog-fuel-select"
              className="catalog-filter-select"
              value={filters.fuelType ?? ""}
              onChange={(e) => void setFilter("fuelType", (e.target.value || undefined) as typeof filters.fuelType)}
            >
              <option value="">{t("catalog.fuel")}</option>
              {options.fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {t(fuelKey[fuel])}
                </option>
              ))}
            </select>
          </div>

          <div className="catalog-filter-panel__row">
            <label className="catalog-filter-panel__label" htmlFor="catalog-price-range">
              {t("catalog.maxPrice")}: {formatCurrency(filters.maxPrice ?? options.priceRange.max)}
            </label>
            <input
              id="catalog-price-range"
              type="range"
              className="filters__range"
              min={options.priceRange.min}
              max={options.priceRange.max}
              step={5000}
              value={filters.maxPrice ?? options.priceRange.max}
              onChange={(e) => void setFilter("maxPrice", Number(e.target.value))}
              aria-label={t("catalog.maxPrice")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
