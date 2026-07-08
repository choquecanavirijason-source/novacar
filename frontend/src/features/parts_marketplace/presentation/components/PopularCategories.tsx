/**
 * Presentation · Component · PopularCategories
 * Grilla de categorías de autopartes con icono + conteo de artículos
 * (estilo "Popular Categories"). Cada tile enlaza al marketplace pre-filtrado.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PartFacets } from "../../domain/entities/PartFilters";
import { marketplaceUseCases } from "../../di";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import { categoryIcon, categoryKey } from "../partPresentation";
import "../styles/marketplace.css";

export function PopularCategories({ limit }: { limit?: number }) {
  const { t } = useTranslation();
  const [facets, setFacets] = useState<PartFacets | null>(null);

  useEffect(() => {
    void marketplaceUseCases.getFacets.execute().then(setFacets);
  }, []);

  const cats = facets ? (limit ? facets.categories.slice(0, limit) : facets.categories) : [];

  return (
    <section style={{ padding: "8px 0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 18 }}>
        <div>
          <Eyebrow>{t("home.popularCategories")}</Eyebrow>
          <h2 style={{ fontSize: "1.7rem", fontWeight: 800, marginTop: 10 }}>{t("home.popularSub")}</h2>
        </div>
        <Link href="/autopartes" style={{ color: "var(--accent-neon)", fontWeight: 700, fontSize: "0.92rem" }}>
          {t("home.viewAll")} →
        </Link>
      </div>

      <div className="cat-tiles">
        {!facets
          ? Array.from({ length: limit ?? 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 110 }} />
            ))
          : cats.map((c, i) => {
              const CategoryIcon = categoryIcon[c.value];
              return (
              <Link
                key={c.value}
                href={`/autopartes?cat=${c.value}`}
                className="cat-tile"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="cat-tile__icon">
                  <CategoryIcon size={24} strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <div className="cat-tile__name">{t(categoryKey(c.value))}</div>
                  <div className="cat-tile__count">
                    {c.count} {t("home.items")}
                  </div>
                </div>
              </Link>
              );
            })}
      </div>
    </section>
  );
}
