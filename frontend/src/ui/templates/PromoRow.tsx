/**
 * Template · PromoRow
 * Fila de 3 banners promocionales (colapsa a 1 en móvil).
 */

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";

export interface PromoItem {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  cta?: string;
  href?: Route | string;
  gradient?: string;
}

interface PromoRowProps {
  items: PromoItem[];
  className?: string;
}

export function PromoRow({ items, className = "" }: PromoRowProps) {
  return (
    <div className={`tpl-promo-row ${className}`.trim()}>
      {items.map((item) => {
        const style: CSSProperties = {
          background: item.gradient ?? "var(--gradient-brand)",
        };

        const inner = (
          <>
            <span className="promo-card__icon" aria-hidden="true">{item.icon}</span>
            <div>
              <div className="promo-card__title">{item.title}</div>
              <div className="promo-card__desc">{item.description}</div>
              {item.cta && <span className="promo-card__cta">{item.cta} →</span>}
            </div>
          </>
        );

        if (item.href) {
          return (
            <Link key={item.id} href={item.href as Route} className="tpl-promo-card" style={style}>
              {inner}
            </Link>
          );
        }

        return (
          <div key={item.id} className="tpl-promo-card" style={style}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}