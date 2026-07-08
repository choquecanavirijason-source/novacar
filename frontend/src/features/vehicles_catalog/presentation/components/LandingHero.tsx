/**
 * Presentation · Component · LandingHero
 * Hero principal estilo e-commerce: texto + CTAs a la izquierda, visual a la derecha.
 * Traducido (ES/EN) y compuesto con atoms.
 */

"use client";

import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import "../styles/home.css";

export function LandingHero() {
  const { t } = useTranslation();

  return (
    <section className="hero-pro">
      <div className="hero-pro__content">
        <span className="section-eyebrow animate-in">⚡ {t("home.heroBadge")}</span>

        <h1 className="hero-pro__title animate-in" style={{ animationDelay: "60ms" }}>
          {t("hero.titleA")} <span className="text-gradient">{t("hero.titleHighlight")}</span>
        </h1>

        <p className="hero-pro__subtitle animate-in" style={{ animationDelay: "120ms" }}>
          {t("hero.subtitle")}
        </p>

        <div className="hero-pro__actions animate-in" style={{ animationDelay: "180ms" }}>
          <Button href="/autopartes">{t("home.shopNow")} →</Button>
          <Button href="/catalogo" variant="ghost">{t("hero.ctaCars")}</Button>
        </div>

        <div className="hero-pro__stats animate-in" style={{ animationDelay: "240ms" }}>
          <div>
            <div className="hero-pro__stat-value text-gradient">1,200+</div>
            <div className="hero-pro__stat-label">{t("hero.statCars")}</div>
          </div>
          <div>
            <div className="hero-pro__stat-value text-gradient">8,500+</div>
            <div className="hero-pro__stat-label">{t("hero.statParts")}</div>
          </div>
          <div>
            <div className="hero-pro__stat-value text-gradient">100%</div>
            <div className="hero-pro__stat-label">{t("hero.statCompat")}</div>
          </div>
        </div>
      </div>

      {/* Visual decorativo (sin assets): tarjeta con gradiente y elementos flotantes */}
      <div className="hero-pro__visual animate-in" style={{ animationDelay: "120ms" }} aria-hidden>
        <div className="hero-pro__glass">
          <span className="hero-pro__car">🚗</span>
          <span className="hero-pro__chip hero-pro__chip--1">🔋 12V</span>
          <span className="hero-pro__chip hero-pro__chip--2">🛞 R16</span>
          <span className="hero-pro__chip hero-pro__chip--3">⚙️ 2.0L</span>
          <span className="hero-pro__chip hero-pro__chip--4">🛡️ 12m</span>
        </div>
      </div>
    </section>
  );
}
