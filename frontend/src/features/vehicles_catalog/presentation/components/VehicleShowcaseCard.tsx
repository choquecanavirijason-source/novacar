/**
 * Presentation · Component · VehicleShowcaseCard
 * Tarjeta de presentación de auto a pantalla completa, split 50/50 (CSS Grid):
 * panel izquierdo con la foto nítida + textos flotantes (HP, subtítulo técnico,
 * paginador vertical); panel derecho glassmorphism (backdrop-blur) con título,
 * subtítulo, descripción y CTA. Estilo monocromático + acento cyan, aislado del
 * tema global (ver vehicle-showcase.css) — todo el texto se recibe por props.
 */

"use client";

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import "../styles/vehicle-showcase.css";

export interface VehicleShowcaseCardProps {
  imageUrl: string;
  imageAlt: string;
  /** Texto grande de esquina superior izquierda (ej. "8000 Horse Power"). */
  hpLabel: ReactNode;
  /** Subtítulo técnico de esquina inferior izquierda (ej. "V8 Turbo Charge"). */
  techLabel: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  description: ReactNode;
  ctaLabel?: ReactNode;
  ctaHref?: Route | string;
  onCtaClick?: () => void;
  totalPages?: number;
  activeIndex?: number;
  onDotClick?: (index: number) => void;
  className?: string;
}

export function VehicleShowcaseCard({
  imageUrl,
  imageAlt,
  hpLabel,
  techLabel,
  title,
  subtitle,
  description,
  ctaLabel = "Read More",
  ctaHref,
  onCtaClick,
  totalPages = 3,
  activeIndex = 0,
  onDotClick,
  className = "",
}: VehicleShowcaseCardProps) {
  const ctaContent = (
    <span className="vshowcase__cta-inner">
      <span className="vshowcase__cta-label">{ctaLabel}</span>
      <span className="vshowcase__cta-icon">
        <Play size={13} fill="currentColor" strokeWidth={0} aria-hidden />
      </span>
    </span>
  );

  return (
    <section className={`vshowcase ${className}`.trim()}>
      {/* eslint-disable-next-line @next/next/no-img-element -- imagen de contenido, cubre todo el card */}
      <img
        className="vshowcase__bg"
        src={imageUrl}
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      <div className="vshowcase__left">
        <div className="vshowcase__hp animate-in">
          <span>{hpLabel}</span>
          <ArrowUpRight size={26} strokeWidth={1.75} aria-hidden />
        </div>

        <div className="vshowcase__paginator" role="tablist" aria-label="slides">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Slide ${i + 1}`}
              className={`vshowcase__dot ${i === activeIndex ? "vshowcase__dot--active" : ""}`}
              onClick={() => onDotClick?.(i)}
            />
          ))}
        </div>

        <div className="vshowcase__tech animate-in">{techLabel}</div>
      </div>

      <div className="vshowcase__right">
        <div className="vshowcase__panel animate-in">
          <h2 className="vshowcase__title">{title}</h2>
          <h3 className="vshowcase__subtitle">{subtitle}</h3>
          <p className="vshowcase__desc">{description}</p>

          {ctaHref ? (
            <Link href={ctaHref as Route} className="vshowcase__cta">
              {ctaContent}
            </Link>
          ) : (
            <button type="button" className="vshowcase__cta" onClick={onCtaClick}>
              {ctaContent}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
