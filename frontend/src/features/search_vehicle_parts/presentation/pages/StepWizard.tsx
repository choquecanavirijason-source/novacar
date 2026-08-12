/**
 * Presentation · Component · StepWizard
 *
 * Buscador inteligente paso a paso: Marca → Modelo → Año → Categoría.
 * Traducido (ES/EN). Orquesta los componentes presentacionales y consume el estado
 * global del módulo (useSearchWizardState), que invoca los Use Cases del dominio.
 */

"use client";

import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchWizardState, type WizardStep } from "../hooks/useSearchWizardState";
import { VehicleSelector } from "../components/VehicleSelector";
import { CompatiblePartsResult } from "../components/CompatiblePartsResult";
import { PART_CATEGORIES, resolveCategoryIcon, resolveCategoryLabel } from "@features/parts_marketplace";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import { Eyebrow } from "@ui/atoms/Eyebrow";
import "../styles/search-module.css";

export function StepWizard() {
  const { t } = useTranslation();
  const s = useSearchWizardState();
  const categoryTrackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  useEffect(() => {
    void s.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollCategories = (delta: number) =>
    categoryTrackRef.current?.scrollBy({ left: delta, behavior: "smooth" });

  // Arrastrar con el mouse para deslizar el carrusel: overflow-x nativo solo
  // responde a touch/trackpad, no a clic-y-arrastrar con mouse de escritorio.
  function handleTrackMouseDown(e: ReactMouseEvent<HTMLDivElement>) {
    const el = categoryTrackRef.current;
    if (!el) return;
    dragRef.current = { down: true, startX: e.pageX, startScroll: el.scrollLeft, moved: false };
    el.classList.add("category-grid--dragging");
  }

  function handleTrackMouseMove(e: ReactMouseEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const el = categoryTrackRef.current;
    if (!drag.down || !el) return;
    const delta = e.pageX - drag.startX;
    if (Math.abs(delta) > 4) drag.moved = true;
    el.scrollLeft = drag.startScroll - delta;
  }

  function endTrackDrag() {
    dragRef.current.down = false;
    categoryTrackRef.current?.classList.remove("category-grid--dragging");
  }

  function selectCategoryUnlessDragged(id: (typeof categories)[number]["id"]) {
    if (dragRef.current.moved) return; // clic al final de un arrastre: ignorar
    s.selectCategory(id);
  }

  const steps = [t("finder.stepBrand"), t("finder.stepModel"), t("finder.stepYear"), t("finder.stepCategory")];

  const categories = PART_CATEGORIES.map((id) => ({
    id,
    Icon: resolveCategoryIcon(id),
    name: resolveCategoryLabel(id, t),
  }));

  return (
    <section style={{ padding: "48px 0" }}>
      <header style={{ textAlign: "center", marginBottom: 32 }}>
        <Eyebrow>{t("nav.finder")}</Eyebrow>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, marginTop: 12 }}>{t("finder.pageTitle")}</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 8 }}>{t("finder.pageSubtitle")}</p>
      </header>

      <div className="wizard" aria-label={t("finder.pageTitle")}>
        {/* Indicador de pasos */}
        <ol className="wizard__steps">
          {steps.map((label, i) => {
            const state = i === s.step ? "active" : i < s.step ? "done" : "idle";
            return (
              <li
                key={label}
                className={`wizard__step ${
                  state === "active" ? "wizard__step--active" : state === "done" ? "wizard__step--done" : ""
                }`}
              >
                <span className="wizard__step-index">{i + 1}</span>
                {label}
              </li>
            );
          })}
        </ol>

        {s.error && <p className="badge badge--out">{s.error}</p>}

        {/* PASO 0 · MARCA */}
        {s.step === 0 && (
          <div>
            <header className="wizard__header">
              <h2 className="wizard__title">{t("finder.brandTitle")}</h2>
              <p className="wizard__subtitle">{s.loading ? t("finder.brandLoading") : t("finder.brandSubtitle")}</p>
            </header>
            <VehicleSelector
              options={s.brands}
              selected={s.brand}
              onSelect={(v) => s.selectBrand(v)}
              placeholder={t("finder.brandSearch")}
              emptyLabel={s.loading ? t("finder.brandLoading") : undefined}
            />
          </div>
        )}

        {/* PASO 1 · MODELO */}
        {s.step === 1 && (
          <div>
            <header className="wizard__header">
              <h2 className="wizard__title">{t("finder.modelTitle", { brand: s.brand ?? "" })}</h2>
              <p className="wizard__subtitle">{t("finder.modelSubtitle")}</p>
            </header>
            <VehicleSelector
              options={s.models}
              selected={s.model}
              onSelect={(v) => s.selectModel(v)}
              placeholder={t("finder.modelSearch")}
              emptyLabel={s.loading ? t("finder.modelLoading") : t("finder.modelEmpty")}
            />
          </div>
        )}

        {/* PASO 2 · AÑO */}
        {s.step === 2 && (
          <div>
            <header className="wizard__header">
              <h2 className="wizard__title">{t("finder.yearTitle", { brand: s.brand ?? "", model: s.model ?? "" })}</h2>
              <p className="wizard__subtitle">{t("finder.yearSubtitle")}</p>
            </header>
            <VehicleSelector
              options={s.years}
              selected={s.year}
              onSelect={(v) => s.selectYear(v)}
              placeholder={t("finder.yearSearch")}
              emptyLabel={s.loading ? t("finder.yearLoading") : t("finder.yearEmpty")}
            />
          </div>
        )}

        {/* PASO 3 · CATEGORÍA + RESULTADOS */}
        {s.step === 3 && (
          <div>
            <header className="wizard__header">
              <h2 className="wizard__title">
                {t("finder.categoryTitle", { brand: s.brand ?? "", model: s.model ?? "", year: s.year ?? "" })}
              </h2>
              <p className="wizard__subtitle">{t("finder.categorySubtitle")}</p>
            </header>
            <div className="category-carousel">
              <button
                type="button"
                className="mk-carousel__arrow"
                onClick={() => scrollCategories(-320)}
                aria-label={t("common.scrollLeft")}
              >
                <ChevronLeft size={18} strokeWidth={2} aria-hidden />
              </button>

              <div
                className="category-grid"
                ref={categoryTrackRef}
                onMouseDown={handleTrackMouseDown}
                onMouseMove={handleTrackMouseMove}
                onMouseUp={endTrackDrag}
                onMouseLeave={endTrackDrag}
              >
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="category-card"
                    onClick={() => selectCategoryUnlessDragged(c.id)}
                    aria-pressed={s.category === c.id}
                    style={
                      s.category === c.id
                        ? { borderColor: "var(--primary-glow)", boxShadow: "var(--glow-primary)" }
                        : undefined
                    }
                  >
                    <div className="category-card__icon">
                      <c.Icon size={26} strokeWidth={1.5} aria-hidden />
                    </div>
                    <div className="category-card__name">{c.name}</div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="mk-carousel__arrow"
                onClick={() => scrollCategories(320)}
                aria-label={t("common.scrollRight")}
              >
                <ChevronRight size={18} strokeWidth={2} aria-hidden />
              </button>
            </div>

            {s.loading ? (
              <p className="empty">{t("finder.searchingParts")}</p>
            ) : (
              <CompatiblePartsResult parts={s.parts} emptyLabel={t("finder.resultsEmpty")} />
            )}
          </div>
        )}

        {/* Navegación */}
        <footer className="wizard__footer">
          <Button variant="ghost" disabled={s.step === 0} onClick={() => s.goTo((s.step - 1) as WizardStep)}>
            ← {t("common.back")}
          </Button>
          <Button variant="ghost" onClick={() => s.reset()}>
            {t("common.reset")}
          </Button>
        </footer>
      </div>
    </section>
  );
}
