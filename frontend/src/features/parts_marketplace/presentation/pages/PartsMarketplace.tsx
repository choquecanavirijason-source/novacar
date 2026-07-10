/**
 * Presentation · Component · PartsMarketplace
 * Orquestador del marketplace: header + búsqueda + banner guiado + filtros + grid + orden.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Filter, ChevronDown, Compass, ShoppingCart, LayoutGrid, LayoutList } from "lucide-react";
import { usePartsMarketplaceStore } from "../store/usePartsMarketplaceStore";
import { useTranslation } from "@core/i18n/I18nProvider";
import type { PartFilters, SortOption } from "../../domain/entities/PartFilters";
import type { PartCategory, PartCondition } from "../../domain/entities/MarketplacePart";
import { Skeleton } from "@ui/atoms/Skeleton";
import { Button } from "@ui/atoms/Button";
import { SearchInput } from "@ui/molecules/SearchInput";
import { Pagination } from "@ui/molecules/Pagination";
import { PartsFilters } from "../components/PartsFilters";
import { PartCard } from "../components/PartCard";
import { FeaturedCategoryBlocks } from "../components/FeaturedCategoryBlocks";
import { TrustBar } from "../components/TrustBar";
import { CategoryTabs } from "../components/CategoryTabs";
import { DiscountBanners } from "@features/vehicles_catalog/presentation/components/DiscountBanners";
import { Section } from "@ui/templates/Section";
import { ScrollReveal } from "@ui/atoms/ScrollReveal";
import "../styles/marketplace.css";

type ViewMode = "horizontal" | "grid";
const PAGE_SIZE = 12;

const SORTS: SortOption[] = ["relevance", "price_asc", "price_desc", "rating"];
const SORT_KEY: Record<SortOption, string> = {
  relevance: "market.sortRelevance",
  price_asc: "market.sortPriceAsc",
  price_desc: "market.sortPriceDesc",
  rating: "market.sortRating",
};

function filtersFromUrl(): Partial<PartFilters> {
  const sp = new URLSearchParams(window.location.search);
  const filters: Partial<PartFilters> = {};
  const cat = sp.get("cat");
  const brands = sp.get("brands");
  const cond = sp.get("cond");
  const minPrice = sp.get("minPrice");
  const maxPrice = sp.get("maxPrice");
  const vbrand = sp.get("vbrand");
  const year = sp.get("year");
  const rating = sp.get("rating");
  const q = sp.get("q");
  const sort = sp.get("sort");
  if (cat) filters.categories = cat.split(",") as PartCategory[];
  if (brands) filters.brands = brands.split(",");
  if (cond) filters.conditions = cond.split(",") as PartCondition[];
  if (minPrice) filters.minPrice = Number(minPrice);
  if (maxPrice) filters.maxPrice = Number(maxPrice);
  if (vbrand) filters.vehicleBrand = vbrand;
  if (year) filters.year = Number(year);
  if (sp.get("shipping") === "1") filters.freeShipping = true;
  if (sp.get("warranty") === "1") filters.withWarranty = true;
  if (sp.get("stock") === "1") filters.inStock = true;
  if (rating) filters.minRating = Number(rating);
  if (q) filters.search = q;
  if (sort) filters.sort = sort as SortOption;
  return filters;
}

function filtersToQuery(filters: PartFilters): string {
  const params = new URLSearchParams();
  if (filters.categories.length) params.set("cat", filters.categories.join(","));
  if (filters.brands.length) params.set("brands", filters.brands.join(","));
  if (filters.conditions.length) params.set("cond", filters.conditions.join(","));
  if (filters.minPrice != null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.vehicleBrand) params.set("vbrand", filters.vehicleBrand);
  if (filters.year != null) params.set("year", String(filters.year));
  if (filters.freeShipping) params.set("shipping", "1");
  if (filters.withWarranty) params.set("warranty", "1");
  if (filters.inStock) params.set("stock", "1");
  if (filters.minRating != null) params.set("rating", String(filters.minRating));
  if (filters.search) params.set("q", filters.search);
  if (filters.sort !== "relevance") params.set("sort", filters.sort);
  return params.toString();
}

export function PartsMarketplace() {
  const { t } = useTranslation();
  const router = useRouter();
  const { results, filters, loading, init, setSearch, setSort } = usePartsMarketplaceStore();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    // La URL manda si trae filtros; si no, respeta lo que ya haya en el store.
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
    router.replace(qs ? `/autopartes?${qs}` : "/autopartes", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, ready]);

  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const paginatedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {/* Bloques sólidos de categorías destacadas (reemplaza el Hero) */}
      <FeaturedCategoryBlocks />

      {/* Barra de confianza (4 beneficios) */}
      <ScrollReveal>
        <Section size="sm">
          <TrustBar />
        </Section>
      </ScrollReveal>

      {/* Banner: búsqueda guiada por compatibilidad (wizard) */}
      <ScrollReveal>
        <div className="mk-guided">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="mk-guided__icon">
              <Compass size={22} strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <strong>{t("market.guided")}</strong>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.86rem" }}>
                {t("finder.pageSubtitle")}
              </div>
            </div>
          </div>
          <Button href="/buscador" variant="ghost" size="sm">{t("nav.finder")} →</Button>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <DiscountBanners />
      </ScrollReveal>

      <div id="mk-product-grid" className="market">
        <h2 className="text-center text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
          {t("market.productsTitle")}
        </h2>

        {/* Carrusel fusionado: tabs de modo (Destacados/Nuevos/Más Vendidos) + categoría */}
        <div className="mt-6">
          <CategoryTabs />
        </div>

        <div className="mk-toolbar">
          <SearchInput
            value={filters.search ?? ""}
            onChange={(v) => void setSearch(v)}
            placeholder={t("market.searchPlaceholder")}
            aria-label={t("market.searchPlaceholder")}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className="mk-filters-toggle"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
            >
              <Filter size={15} strokeWidth={2} aria-hidden />
              {t("market.filters")}
              <ChevronDown size={15} strokeWidth={2} aria-hidden />
            </button>
            <span
              style={{ color: "var(--text-muted)", fontSize: "0.86rem", whiteSpace: "nowrap" }}
              aria-live="polite"
            >
              {loading ? "…" : t("market.count", { n: results.length })}
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
            <select
              className="mk-select"
              style={{ width: "auto" }}
              value={filters.sort}
              onChange={(e) => void setSort(e.target.value as SortOption)}
              aria-label={t("market.sortBy")}
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>{t(SORT_KEY[s])}</option>
              ))}
            </select>
          </div>
        </div>

        {filtersOpen && <PartsFilters />}

        {loading ? (
          <div className="mk-grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} height={300} radius="var(--radius-lg)" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="mk-empty">
            <div style={{ marginBottom: 10, color: "var(--accent-neon)" }}>
              <ShoppingCart size={40} strokeWidth={1.5} aria-hidden />
            </div>
            <strong style={{ display: "block", marginBottom: 6 }}>{t("market.emptyTitle")}</strong>
            {t("market.empty")}
            <div style={{ marginTop: 16 }}>
              <Link href="/buscador" style={{ color: "var(--accent-neon)", fontWeight: 700 }}>
                {t("market.guided")} →
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className={`mk-grid ${viewMode === "horizontal" ? "mk-grid--list" : ""}`}>
              {paginatedResults.map((p, i) => (
                <PartCard key={p.id} part={p} index={i} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </>
  );
}
