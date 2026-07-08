/**
 * Presentation · Component · CatalogExplorer
 * Orquesta header + filtros + búsqueda + grid de resultados. Carga datos al montar.
 */

"use client";

import { useEffect } from "react";
import { useCatalogStore } from "../store/useCatalogStore";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import { Skeleton } from "@ui/atoms/Skeleton";
import { SearchInput } from "@ui/molecules/SearchInput";
import { CatalogFilters } from "../components/CatalogFilters";
import { VehicleCard } from "../components/VehicleCard";
import "../styles/catalog.css";

export function CatalogExplorer() {
  const { t } = useTranslation();
  const { vehicles, filters, loading, init, setFilter } = useCatalogStore();

  useEffect(() => {
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section style={{ padding: "40px 0 0" }}>
      <header style={{ marginBottom: 28 }}>
        <Eyebrow>{t("catalog.eyebrow")}</Eyebrow>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 900, marginTop: 12 }}>
          {t("catalog.titleA")} <span className="text-gradient">{t("catalog.titleHighlight")}</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>{t("catalog.subtitle")}</p>
      </header>

      <div className="explorer">
        <CatalogFilters />

        <div>
          <div className="catalog-toolbar">
            <SearchInput
              value={filters.search ?? ""}
              onChange={(v) => void setFilter("search", v || undefined)}
              placeholder={t("catalog.searchPlaceholder")}
              aria-label={t("catalog.searchPlaceholder")}
            />
            <span style={{ color: "var(--text-muted)", fontSize: "0.88rem", whiteSpace: "nowrap" }}>
              {loading ? t("catalog.searching") : t("catalog.count", { n: vehicles.length })}
            </span>
          </div>

          {loading ? (
            <div className="catalog-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height={320} radius="var(--radius-lg)" />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "2.4rem", marginBottom: 10 }}>🔍</div>
              <strong style={{ display: "block", marginBottom: 6 }}>{t("catalog.emptyTitle")}</strong>
              {t("catalog.empty")}
            </div>
          ) : (
            <div className="catalog-grid">
              {vehicles.map((v, i) => (
                <VehicleCard key={v.id} vehicle={v} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
