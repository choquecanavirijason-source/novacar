/**
 * Molecule · Breadcrumbs
 * Rastro de navegación (Home / Sección / Actual) para páginas de detalle.
 * El último item nunca es un link (representa la página actual).
 */

import Link from "next/link";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: Route | string;
}

export function Breadcrumbs({ items, className = "" }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`breadcrumbs ${className}`.trim()}>
      <ol className="breadcrumbs__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="breadcrumbs__item">
              {item.href && !isLast ? (
                <Link href={item.href as Route} className="breadcrumbs__link">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumbs__current" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight size={13} strokeWidth={2} className="breadcrumbs__sep" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
