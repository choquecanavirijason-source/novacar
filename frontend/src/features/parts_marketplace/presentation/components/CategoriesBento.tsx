/**
 * Presentation · Component · CategoriesBento
 * Sección "Categorías populares" del Home. El botón "Ver categorías" abre un
 * popup (modal, con a11y: Escape/focus-trap/focus-restore) mostrando todas
 * las categorías del marketplace en un bento — en vez del dropdown inline
 * que había antes.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import type { PartFacets } from "../../domain/entities/PartFilters";
import { marketplaceUseCases } from "../../di";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import { useModalA11y } from "@ui/hooks/useModalA11y";
import { categoryIcon, categoryKey } from "../partPresentation";
import "../styles/marketplace.css";

export function CategoriesBento() {
  const { t } = useTranslation();
  const [facets, setFacets] = useState<PartFacets | null>(null);
  const [open, setOpen] = useState(false);
  const panelRef = useModalA11y<HTMLDivElement>(() => setOpen(false));

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

      <button type="button" className="categories-trigger" onClick={() => setOpen(true)}>
        <span>{t("home.viewCategories")}</span>
        <ChevronDown size={16} strokeWidth={2} aria-hidden />
      </button>

      {open && (
        <div
          className="categories-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t("home.categoriesModalTitle")}
          onClick={() => setOpen(false)}
        >
          <div
            ref={panelRef}
            tabIndex={-1}
            className="categories-modal glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="categories-modal__close"
              onClick={() => setOpen(false)}
              aria-label={t("productInquiry.close")}
            >
              <X size={18} strokeWidth={1.75} aria-hidden />
            </button>

            <h3 className="categories-modal__title">{t("home.categoriesModalTitle")}</h3>

            {!facets ? (
              <div className="bento bento--stacked">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton bento__item" style={{ minHeight: 90 }} />
                ))}
              </div>
            ) : (
              <div className="bento bento--stacked">
                {cats.map((c, i) => {
                  const CategoryIcon = categoryIcon[c.value];
                  return (
                    <Link
                      key={c.value}
                      href={`/autopartes?cat=${c.value}`}
                      className="bento__item bento__item--row"
                      style={{ animationDelay: `${i * 35}ms` }}
                      onClick={() => setOpen(false)}
                    >
                      <div className="bento__row-main">
                        <span className="bento__icon bento__icon--row">
                          <CategoryIcon size={24} strokeWidth={1.5} aria-hidden />
                        </span>
                        <div className="bento__meta">
                          <div className="bento__name">{t(categoryKey(c.value))}</div>
                          <div className="bento__count">
                            {c.count} {t("home.items")}
                          </div>
                        </div>
                      </div>
                      <span className="bento__cta">{t("home.bentoCta")} →</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
