/**
 * Presentation · Component · HeroShowcase
 * Hero principal estilo HUD Sci-Fi: fondo radial + texto gigante/cápsula detrás,
 * auto en vista de pájaro superpuesto, dashboard inferior curvo de 5 segmentos
 * (03 activo) y paginadores laterales. Al hacer click en el auto se abre
 * VehiclePartsModal con el estado de sus autopartes.
 */

"use client";

import { type CSSProperties } from "react";
import { Gauge, Wind, Layers, SlidersHorizontal, BatteryCharging, type LucideIcon } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import "../styles/hero-showcase.css";

const SIDE_DOTS = 5;
const ACTIVE_INDEX = 2;

interface InactiveSegment {
  icon: LucideIcon;
  label: string;
}

export function HeroShowcase() {
  const { t } = useTranslation();

  const segments: Array<InactiveSegment | null> = [
    { icon: Wind, label: t("hero2.seg1") },
    { icon: Layers, label: t("hero2.seg2") },
    null,
    { icon: SlidersHorizontal, label: t("hero2.seg4") },
    { icon: BatteryCharging, label: t("hero2.seg5") },
  ];

  return (
    <section className="hero2">
      <div className="hero2__bg" aria-hidden />

      <div className="hero2__bgtext" aria-hidden>
        <span className="hero2__capsule" />
        <h1 className="hero2__giant">{t("hero2.bgWord")}</h1>
      </div>

      <div className="hero2__side hero2__side--left" aria-hidden>
        {Array.from({ length: SIDE_DOTS }).map((_, i) => (
          <span key={i} className={`hero2__dot ${i === ACTIVE_INDEX ? "hero2__dot--active" : ""}`} />
        ))}
      </div>
      <div className="hero2__side hero2__side--right" aria-hidden>
        {Array.from({ length: SIDE_DOTS }).map((_, i) => (
          <span key={i} className={`hero2__dot ${i === ACTIVE_INDEX ? "hero2__dot--active" : ""}`} />
        ))}
      </div>

      <div className="hero2__hud">
        {segments.map((seg, i) => {
          const isActive = i === ACTIVE_INDEX;
          const Icon = seg?.icon;
          const tiltStyle = { "--hero2-tilt": `${(i - ACTIVE_INDEX) * 6}deg` } as CSSProperties;

          return (
            <div
              key={i}
              className={`hero2__segment ${isActive ? "hero2__segment--active" : ""}`}
              style={tiltStyle}
            >
              <span className="hero2__segment-index">0{i + 1}</span>

              {isActive ? (
                <div className="hero2__segment-content">
                  <h2 className="hero2__segment-title">{t("hero2.title")}</h2>
                  <p className="hero2__segment-desc">{t("hero2.desc")}</p>
                  <div className="hero2__gauge">
                    <Gauge size={16} strokeWidth={1.75} aria-hidden />
                    <span>{t("hero2.gauge")}</span>
                  </div>
                </div>
              ) : (
                Icon &&
                seg && (
                  <div className="hero2__segment-inactive">
                    <Icon size={20} strokeWidth={1.5} aria-hidden />
                    <span>{seg.label}</span>
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
