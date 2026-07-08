/**
 * Molecule · SpecBadge
 * Pequeña etiqueta de especificación (icono + texto) para cards de auto.
 */

import type { ReactNode } from "react";

export function SpecBadge({ icon, children }: { icon?: string; children: ReactNode }) {
  return (
    <span className="spec-badge">
      {icon && <span aria-hidden>{icon}</span>}
      {children}
    </span>
  );
}
