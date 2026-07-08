/**
 * Presentation · Component · CatalogFilters
 * Panel de filtros reactivo, traducido. Consume el store del catálogo y atoms.
 */

"use client";

import { useCatalogStore } from "../store/useCatalogStore";
import { formatCurrency } from "@core/format/formatters";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Chip } from "@ui/atoms/Chip";
import { bodyTypeKey, fuelKey } from "../vehiclePresentation";

export function CatalogFilters() {
  const { t } = useTranslation();
  const { options, filters, setFilter, clearFilters } = useCatalogStore();

  if (!options) return <div className="card filters skeleton" style={{ height: 320 }} />;

  const hasFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <aside className="card filters">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <strong>{t("catalog.filters")}</strong>
        {hasFilters && (
          <button
            type="button"
            onClick={() => void clearFilters()}
            style={{ background: "none", color: "var(--accent-neon)", fontSize: "0.8rem", fontWeight: 700 }}
          >
            {t("common.clear")}
          </button>
        )}
      </div>

      <div className="filters__group">
        <span className="filters__label">{t("catalog.brand")}</span>
        <div className="filters__chips">
          {options.brands.map((brand) => (
            <Chip key={brand} active={filters.brand === brand} onClick={() => void setFilter("brand", brand)}>
              {brand}
            </Chip>
          ))}
        </div>
      </div>

      <div className="filters__group">
        <span className="filters__label">{t("catalog.body")}</span>
        <div className="filters__chips">
          {options.bodyTypes.map((body) => (
            <Chip key={body} active={filters.bodyType === body} onClick={() => void setFilter("bodyType", body)}>
              {t(bodyTypeKey[body])}
            </Chip>
          ))}
        </div>
      </div>

      <div className="filters__group">
        <span className="filters__label">{t("catalog.fuel")}</span>
        <div className="filters__chips">
          {options.fuelTypes.map((fuel) => (
            <Chip key={fuel} active={filters.fuelType === fuel} onClick={() => void setFilter("fuelType", fuel)}>
              {t(fuelKey[fuel])}
            </Chip>
          ))}
        </div>
      </div>

      <div className="filters__group" style={{ marginBottom: 0 }}>
        <span className="filters__label">
          {t("catalog.maxPrice")}: {formatCurrency(filters.maxPrice ?? options.priceRange.max)}
        </span>
        <input
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
    </aside>
  );
}
