/**
 * Template · HeroSplit
 * Hero premium: texto + CTAs a la izquierda, visual a la derecha.
 * Mobile: visual arriba (visualFirstOnMobile).
 */

import type { ReactNode } from "react";

export interface HeroStat {
  value: ReactNode;
  label: string;
}

interface HeroSplitProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
  stats?: HeroStat[];
  visual?: ReactNode;
  visualFirstOnMobile?: boolean;
  className?: string;
}

export function HeroSplit({
  eyebrow,
  title,
  subtitle,
  actions,
  stats,
  visual,
  visualFirstOnMobile = true,
  className = "",
}: HeroSplitProps) {
  const heroClass = [
    "tpl-hero",
    visualFirstOnMobile ? "tpl-hero--visual-first" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={heroClass}>
      <div className="tpl-hero__content">
        {eyebrow && (
          <span className="section-eyebrow animate-in">{eyebrow}</span>
        )}

        <h1 className="tpl-hero__title animate-in" style={{ animationDelay: "60ms" }}>
          {title}
        </h1>

        {subtitle && (
          <p className="tpl-hero__subtitle animate-in" style={{ animationDelay: "120ms" }}>
            {subtitle}
          </p>
        )}

        {actions && (
          <div className="tpl-hero__actions animate-in" style={{ animationDelay: "180ms" }}>
            {actions}
          </div>
        )}

        {stats && stats.length > 0 && (
          <div className="tpl-hero__stats animate-in" style={{ animationDelay: "240ms" }}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="tpl-hero__stat-value text-gradient">{stat.value}</div>
                <div className="tpl-hero__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {visual && (
        <div className="tpl-hero__visual animate-in" style={{ animationDelay: "120ms" }}>
          {visual}
        </div>
      )}
    </section>
  );
}

/** Visual decorativo por defecto (gradiente + slot central). */
export function HeroVisualShell({ children }: { children?: ReactNode }) {
  return <div className="tpl-hero__glass">{children}</div>;
}