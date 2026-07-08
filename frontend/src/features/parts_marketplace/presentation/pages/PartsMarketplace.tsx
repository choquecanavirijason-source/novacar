/**
 * Presentation · Component · PartsMarketplace
 * Orquestador del marketplace: header + búsqueda + banner guiado + filtros + grid + orden.
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePartsMarketplaceStore } from "../store/usePartsMarketplaceStore";
import { useTranslation } from "@core/i18n/I18nProvider";
import type { SortOption } from "../../domain/entities/PartFilters";
import { Skeleton } from "@ui/atoms/Skeleton";
import { Button } from "@ui/atoms/Button";
import { SearchInput } from "@ui/molecules/SearchInput";
import { PartsFilters } from "../components/PartsFilters";
import { PartCard } from "../components/PartCard";
import { PartsHero } from "../components/PartsHero";
import { TrustBar } from "../components/TrustBar";
import { CategoryTabs } from "../components/CategoryTabs";
import { DiscountBanners } from "@features/vehicles_catalog/presentation/components/DiscountBanners";
import { Section } from "@ui/templates/Section";
import "../styles/marketplace.css";

const SORTS: SortOption[] = ["relevance", "price_asc", "price_desc", "rating"];
const SORT_KEY: Record<SortOption, string> = {
  relevance: "market.sortRelevance",
  price_asc: "market.sortPriceAsc",
  price_desc: "market.sortPriceDesc",
  rating: "market.sortRating",
};

export function PartsMarketplace() {
  const { t } = useTranslation();
  const { results, filters, loading, init, setSearch, setSort } = usePartsMarketplaceStore();

  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get("cat");
    void init(cat ? { categories: [cat as never] } : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Hero estilo Brator */}
      <PartsHero />

      {/* Barra de confianza (4 beneficios) */}
      <Section size="sm">
        <TrustBar />
      </Section>

      {/* Banner: búsqueda guiada por compatibilidad (wizard) */}
      <div className="mk-guided">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.6rem" }}>🧭</span>
          <div>
            <strong>{t("market.guided")}</strong>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.86rem" }}>
              {t("finder.pageSubtitle")}
            </div>
          </div>
        </div>
        <Button href="/buscador" variant="ghost" size="sm">{t("nav.finder")} →</Button>
      </div>

      <DiscountBanners />

      {/* Tabs de categoría (estilo "Featured Product" de Brator) */}
      <CategoryTabs />

      <div className="market">
        <PartsFilters />

        <div>
          <div className="mk-toolbar">
            <SearchInput
              value={filters.search ?? ""}
              onChange={(v) => void setSearch(v)}
              placeholder={t("market.searchPlaceholder")}
              aria-label={t("market.searchPlaceholder")}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.86rem", whiteSpace: "nowrap" }}>
                {loading ? "…" : t("market.count", { n: results.length })}
              </span>
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

          {loading ? (
            <div className="mk-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} height={300} radius="var(--radius-lg)" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="mk-empty">
              <div style={{ fontSize: "2.6rem", marginBottom: 10 }}>🛒</div>
              <strong style={{ display: "block", marginBottom: 6 }}>{t("market.emptyTitle")}</strong>
              {t("market.empty")}
              <div style={{ marginTop: 16 }}>
                <Link href="/buscador" style={{ color: "var(--accent-neon)", fontWeight: 700 }}>
                  {t("market.guided")} →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mk-grid">
              {results.map((p, i) => (
                <PartCard key={p.id} part={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
