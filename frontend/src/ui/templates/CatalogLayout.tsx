/**
 * Template · CatalogLayout
 * Sidebar de filtros sticky + área principal con toolbar y contenido.
 */

import type { ReactNode } from "react";

interface CatalogLayoutProps {
  sidebar: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function CatalogLayout({ sidebar, toolbar, children, className = "" }: CatalogLayoutProps) {
  return (
    <div className={`tpl-catalog ${className}`.trim()}>
      <aside className="tpl-catalog__sidebar">{sidebar}</aside>
      <div>
        {toolbar && <div className="tpl-catalog__toolbar">{toolbar}</div>}
        {children}
      </div>
    </div>
  );
}