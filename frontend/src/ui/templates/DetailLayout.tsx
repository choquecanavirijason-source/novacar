/**
 * Template · DetailLayout
 * Página de detalle: media grande + panel de información.
 */

import type { ReactNode } from "react";

interface DetailLayoutProps {
  media: ReactNode;
  info: ReactNode;
  className?: string;
}

export function DetailLayout({ media, info, className = "" }: DetailLayoutProps) {
  return (
    <div className={`tpl-detail ${className}`.trim()}>
      <div className="tpl-detail__media">{media}</div>
      <div className="tpl-detail__info">{info}</div>
    </div>
  );
}