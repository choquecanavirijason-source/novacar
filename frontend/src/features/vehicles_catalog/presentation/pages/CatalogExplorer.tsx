/**
 * Presentation · Component · CatalogExplorer
 * Orquesta header + filtros + búsqueda + grid de resultados. Carga datos al
 * montar y mantiene los filtros sincronizados con la URL (?brand=&body=&
 * fuel=&maxPrice=&q=) para que la vista filtrada sea compartible/bookmarkable
 * y el botón "atrás" del navegador la restaure.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, LayoutList, SearchX } from "lucide-react";
import type { BodyType, FuelType, VehicleFilters } from "../../domain/entities/CatalogVehicle";
import { useCatalogStore } from "../store/useCatalogStore";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import { Skeleton } from "@ui/atoms/Skeleton";
import { SearchInput } from "@ui/molecules/SearchInput";
import { Pagination } from "@ui/molecules/Pagination";
import { CatalogFilters } from "../components/CatalogFilters";
import { VehicleShowcaseSlide } from "../components/VehicleShowcaseSlide";
import { VehicleGridCard } from "../components/VehicleGridCard";
import "../styles/catalog.css";

type ViewMode = "horizontal" | "grid";
const PAGE_SIZE = 8;

function filtersFromUrl(): VehicleFilters {
  const sp = new URLSearchParams(window.location.search);
  const filters: VehicleFilters = {};
  const brand = sp.get("brand");
  const body = sp.get("body");
  const fuel = sp.get("fuel");
  const maxPrice = sp.get("maxPrice");
  const q = sp.get("q");
  if (brand) filters.brand = brand;
  if (body) filters.bodyType = body as BodyType;
  if (fuel) filters.fuelType = fuel as FuelType;
  if (maxPrice) filters.maxPrice = Number(maxPrice);
  if (q) filters.search = q;
  return filters;
}

function filtersToQuery(filters: VehicleFilters): string {
  const params = new URLSearchParams();
  if (filters.brand) params.set("brand", filters.brand);
  if (filters.bodyType) params.set("body", filters.bodyType);
  if (filters.fuelType) params.set("fuel", filters.fuelType);
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.search) params.set("q", filters.search);
  return params.toString();
}

export function CatalogExplorer() {
  const { t } = useTranslation();
  const router = useRouter();
  const { vehicles, filters, loading, init, setFilter } = useCatalogStore();
  const [ready, setReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("horizontal");
  const [page, setPage] = useState(1);

  useEffect(() => {
    // La URL manda si trae filtros; si no, respeta lo que ya haya en el store
    // (ej. el buscador rápido del Home, que navega a /catalogo sin query string).
    const fromUrl = filtersFromUrl();
    void init(Object.keys(fromUrl).length > 0 ? fromUrl : undefined).then(() => setReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (!ready) return;
    const qs = filtersToQuery(filters);
    router.replace(qs ? `/catalogo?${qs}` : "/catalogo", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, ready]);

  const totalPages = Math.ceil(vehicles.length / PAGE_SIZE);
  const paginatedVehicles = vehicles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        <div className="catalog-toolbar">
          <div className="catalog-toolbar__controls">
            <SearchInput
              value={filters.search ?? ""}
              onChange={(v) => void setFilter("search", v || undefined)}
              placeholder={t("catalog.searchPlaceholder")}
              aria-label={t("catalog.searchPlaceholder")}
            />
            <CatalogFilters />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{ color: "var(--text-muted)", fontSize: "0.88rem", whiteSpace: "nowrap" }}
              aria-live="polite"
            >
              {loading ? t("catalog.searching") : t("catalog.count", { n: vehicles.length })}
            </span>

            <div className="catalog-view-toggle" role="group" aria-label="view mode">
              <button
                type="button"
                className={`catalog-view-toggle__btn ${viewMode === "horizontal" ? "catalog-view-toggle__btn--active" : ""}`}
                onClick={() => setViewMode("horizontal")}
                aria-pressed={viewMode === "horizontal"}
                aria-label={t("catalog.viewHorizontal")}
              >
                <LayoutList size={16} strokeWidth={2} aria-hidden />
              </button>
              <button
                type="button"
                className={`catalog-view-toggle__btn ${viewMode === "grid" ? "catalog-view-toggle__btn--active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                aria-label={t("catalog.viewGrid")}
              >
                <LayoutGrid size={16} strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={viewMode === "grid" ? "catalog-grid--fixed" : "catalog-grid"}>
            {Array.from({ length: viewMode === "grid" ? 8 : 6 }).map((_, i) => (
              <Skeleton key={i} height={viewMode === "grid" ? 340 : 320} radius="var(--radius-lg)" />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="empty-state">
            <div style={{ marginBottom: 10, color: "var(--accent-neon)" }}>
              <SearchX size={38} strokeWidth={1.5} aria-hidden />
            </div>
            <strong style={{ display: "block", marginBottom: 6 }}>{t("catalog.emptyTitle")}</strong>
            {t("catalog.empty")}
          </div>
        ) : viewMode === "grid" ? (
          <div className="catalog-grid--fixed">
            {paginatedVehicles.map((v, i) => (
              <VehicleGridCard key={v.id} vehicle={v} index={i} />
            ))}
          </div>
        ) : (
          <div className="vehicle-stack">
            {paginatedVehicles.map((v, i) => (
              <VehicleShowcaseSlide key={v.id} vehicle={v} index={i} total={paginatedVehicles.length} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </section>
  );
}
