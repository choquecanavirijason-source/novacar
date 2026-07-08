/**
 * Template · FeatureGrid
 * Grid de beneficios / features (4 → 2 → 1 columnas).
 */

import type { ReactNode } from "react";

export interface FeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  className?: string;
}

export function FeatureGrid({ items, className = "" }: FeatureGridProps) {
  return (
    <div className={`tpl-features ${className}`.trim()}>
      {items.map((item) => (
        <div key={item.title} className="tpl-feature-card animate-in">
          <div className="tpl-feature-card__icon" aria-hidden="true">
            {item.icon}
          </div>
          <div className="tpl-feature-card__title">{item.title}</div>
          <p className="tpl-feature-card__desc">{item.description}</p>
        </div>
      ))}
    </div>
  );
}