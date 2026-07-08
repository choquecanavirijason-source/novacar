/**
 * Presentation · Component · CategoriesBento
 * Grilla "bento" de categorías de autopartes con una tarjeta destacada (estilo
 * agencia premium). Cada tile enlaza al marketplace pre-filtrado.
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

// Patrón de tamaños para el efecto bento (por índice).
const SPAN: Record<number, string> = {
  0: "bento__item--featured",
  3: "bento__item--wide",
  6: "bento__item--tall",
  9: "bento__item--wide",
};

export function CategoriesBento() {
  const { t } = useTranslation();
  const [facets, setFacets] = useState<PartFacets | null>(null);

  useEffect(() => {
    void marketplaceUseCases.getFacets.execute().then(setFacets);
  }, []);

  const cats = facets?.categories ?? [];

  return (
    <section style={{ padding: "16px 0 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 20 }}>
        <div>
          <Eyebrow>{t("home.popularCategories")}</Eyebrow>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, marginTop: 10, letterSpacing: "-0.01em" }}>
            {t("home.popularSub")}
          </h2>
        </div>
        <Link href="/autopartes" style={{ color: "var(--accent-neon)", fontWeight: 700, fontSize: "0.92rem" }}>
          {t("home.viewAll")} →
        </Link>
      </div>

      {!facets ? (
        <div className="bento">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`skeleton ${SPAN[i] ?? ""}`} style={{ minHeight: 150 }} />
          ))}
        </div>
      ) : (
        <div className="bento">
          {cats.map((c, i) => {
            const featured = i === 0;
            return (
              <Link
                key={c.value}
                href={`/autopartes?cat=${c.value}`}
                className={`bento__item ${SPAN[i] ?? ""} ${featured ? "bento__item--accent" : ""}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="bento__icon">{categoryIcon[c.value]}</span>
                <div className="bento__meta">
                  <div className="bento__name">{t(categoryKey(c.value))}</div>
                  <div className="bento__count">
                    {c.count} {t("home.items")}
                  </div>
                </div>
                {featured && <span className="bento__cta">{t("home.bentoCta")} →</span>}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
