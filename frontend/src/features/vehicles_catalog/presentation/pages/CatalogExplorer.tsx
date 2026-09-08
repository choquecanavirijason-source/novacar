// src/features/vehicles_catalog/presentation/pages/CatalogExplorer.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, LayoutList, SearchX } from "lucide-react";
import type { BodyType, FuelType, VehicleFilters } from "../../domain/entities/CatalogVehicle";
import { useCatalogStore } from "../store/useCatalogStore";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import { ScrollReveal } from "@ui/atoms/ScrollReveal";
import { Skeleton } from "@ui/atoms/Skeleton";
import { SearchInput } from "@ui/molecules/SearchInput";
import { Pagination } from "@ui/molecules/Pagination";
import { CatalogFilters } from "../components/CatalogFilters";
import { VehicleShowcaseSlide } from "../components/VehicleShowcaseSlide";
import { VehicleGridCard } from "../components/VehicleGridCard";
import "../styles/catalog.css";

type ViewMode = "horizontal" | "grid";
const PAGE_SIZE = 8;

function filtersFromUrl(searchParams: URLSearchParams): VehicleFilters {
  const filters: VehicleFilters = {};
  const brand = searchParams.get("brand");
  const body = searchParams.get("body");
  const fuel = searchParams.get("fuel");
  const maxPrice = searchParams.get("maxPrice");
  const q = searchParams.get("q");
  
  if (brand) filters.brand = brand;
  if (body) filters.bodyType = body as BodyType;
  if (fuel) filters.fuelType = fuel as FuelType;
  if (maxPrice) filters.maxPrice = Number(maxPrice);
  if (q) filters.search = q;
  
  return filters;
}

export function CatalogExplorer() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { vehicles, filters, loading, init, setFilter, clearFilters } = useCatalogStore();
  const [ready, setReady] = useState(false);
 const [viewMode, setViewMode] = useState<ViewMode>("horizontal");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fromUrl = filtersFromUrl(searchParams);
    const hasFilters = Object.keys(fromUrl).length > 0;
    init(hasFilters ? fromUrl : undefined).then(() => setReady(true));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams();
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.bodyType) params.set("body", filters.bodyType);
    if (filters.fuelType) params.set("fuel", filters.fuelType);
    if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
    if (filters.search) params.set("q", filters.search);
    const qs = params.toString();
    router.replace(qs ? `/catalogo?${qs}` : "/catalogo", { scroll: false });
  }, [filters, ready]);

  const totalPages = useMemo(() => Math.ceil(vehicles.length / PAGE_SIZE), [vehicles.length]);
  const paginatedVehicles = useMemo(() => 
    vehicles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [vehicles, page]
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const explorerEl = document.querySelector('.explorer');
    if (explorerEl) {
      explorerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    setPage(1);
  };

  const hasActiveFilters = !!(filters.brand || filters.bodyType || filters.fuelType || filters.maxPrice || filters.search);

  return (
    <section className="catalog-explorer-section">
      <ScrollReveal>
        <header className="catalog-header">
          <Eyebrow>{t("catalog.eyebrow")}</Eyebrow>
          <h1 className="catalog-title">
            {t("catalog.titleA")} <span className="text-gradient">{t("catalog.titleHighlight")}</span>
          </h1>
          <p className="catalog-subtitle">{t("catalog.subtitle")}</p>
        </header>
      </ScrollReveal>

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
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="clear-filters-btn"
                aria-label={t("catalog.clearFilters")}
              >
                ✕ {t("catalog.clearFilters")}
              </button>
            )}
          </div>
          <div className="catalog-toolbar__right">
            <span className="catalog-count" aria-live="polite">
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

        <div className="catalog-results-container">
          {loading ? (
            <div className={viewMode === "grid" ? "catalog-grid--fixed" : "catalog-grid"}>
              {Array.from({ length: viewMode === "grid" ? 8 : 6 }).map((_, i) => (
                <Skeleton key={i} height={viewMode === "grid" ? 340 : 320} radius="var(--radius-lg)" />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <SearchX size={38} strokeWidth={1.5} aria-hidden />
              </div>
              <strong className="empty-state__title">{t("catalog.emptyTitle")}</strong>
              <p className="empty-state__text">{t("catalog.empty")}</p>
              {hasActiveFilters && (
                <button onClick={handleClearFilters} className="btn btn--primary empty-state__action">
                  {t("catalog.clearFilters")}
                </button>
              )}
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
                <VehicleShowcaseSlide key={v.id} vehicle={v} index={i} />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        )}
      </div>
    </section>
  );
}