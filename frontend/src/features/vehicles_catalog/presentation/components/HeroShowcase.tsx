/**
 * Presentation · Component · HeroShowcase
 * Hero cinematográfico (estilo Brator): lienzo negro con degradado radial +
 * "suelo" simulado. El contenido vive dentro de `.hero3__inner` — el mismo
 * `.container` (max-width + centrado) que usa el Navbar — para que el
 * bloque de texto quede siempre alineado con el logo, sin importar el ancho
 * de pantalla. Texto en la mitad izquierda; auto (PNG transparente) en la
 * mitad derecha, con posicionamiento absoluto interno para poder superponer
 * ligeramente el texto sin afectar su ancho/posición.
 */

"use client";

import { Gauge } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import "../styles/hero-showcase.css";

const HERO_CAR_PNG = "/car-azul-hero.png";

export function HeroShowcase() {
  const { t } = useTranslation();

  return (
    <section className="hero3">
      <div className="hero3__bg" aria-hidden />

      <div className="hero3__inner container">
        <div className="hero3__copy">
          <h1 className="hero3__title">
            <span className="hero3__title-line hero3__title-line--metal">
              {t("hero2.titleTop")}
            </span>
            <span className="hero3__title-line hero3__title-line--gold">
              {t("hero2.titleBottom")}
            </span>
          </h1>

          <p className="hero3__desc">{t("hero2.desc")}</p>

          <div className="hero3__gauge">
            <Gauge size={16} strokeWidth={1.75} aria-hidden />
            <span>{t("hero2.gauge")}</span>
          </div>

          <div className="hero3__actions">
            <Button href="/catalogo">{t("hero.ctaCars")}</Button>
            <Button href="/autopartes" variant="ghost">{t("hero.ctaParts")}</Button>
          </div>
        </div>

        <div className="hero3__car-slot" aria-hidden>
          <div className="hero3__car-shadow" />
          {/* eslint-disable-next-line @next/next/no-img-element -- PNG transparente manual, con fallback silencioso */}
          <img
            className="hero3__car-img"
            src={HERO_CAR_PNG}
            alt=""
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </div>
    </section>
  );
}
