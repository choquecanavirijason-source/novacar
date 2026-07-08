/**
 * Template · CTABand
 * Banda de llamada a la acción centrada con glow sutil.
 */

import type { ReactNode } from "react";

interface CTABandProps {
  title: ReactNode;
  subtitle?: string;
  actions: ReactNode;
  className?: string;
}

export function CTABand({ title, subtitle, actions, className = "" }: CTABandProps) {
  return (
    <div className={`tpl-cta ${className}`.trim()}>
      <h2 className="tpl-cta__title">{title}</h2>
      {subtitle && <p className="tpl-cta__subtitle">{subtitle}</p>}
      <div className="tpl-cta__actions">{actions}</div>
    </div>
  );
}