/**
 * Atom · Eyebrow
 * Etiqueta de sección (pequeña, cyan, sobre títulos).
 */

import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="section-eyebrow">{children}</span>;
}
