/**
 * Template · TestimonialGrid
 * Grid de testimonios (3 → 1 columnas).
 */

import type { ReactNode } from "react";

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: ReactNode;
}

interface TestimonialGridProps {
  items: TestimonialItem[];
  className?: string;
}

export function TestimonialGrid({ items, className = "" }: TestimonialGridProps) {
  return (
    <div className={`tpl-testi-grid ${className}`.trim()}>
      {items.map((item, i) => (
        <article
          key={item.id}
          className="tpl-testi-card animate-in"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <span className="testi-quote" aria-hidden="true">"</span>
          <p className="testi-text">{item.quote}</p>
          <footer className="testi-author">
            {item.avatar ?? (
              <span
                className="testi-avatar"
                style={{ background: "var(--gradient-brand)" }}
                aria-hidden="true"
              >
                {item.author.charAt(0)}
              </span>
            )}
            <div>
              <span className="testi-name">{item.author}</span>
              {item.role && <span className="testi-role">{item.role}</span>}
            </div>
          </footer>
        </article>
      ))}
    </div>
  );
}