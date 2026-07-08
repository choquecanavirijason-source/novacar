/**
 * Template · PageShell
 * Estructura de página interna: encabezado + contenido.
 * Para landings con muchas secciones, usa Section + SectionHeader directamente.
 */

import type { ReactNode } from "react";
import { SectionHeader } from "../molecules/SectionHeader";

interface PageShellProps {
  eyebrow?: string;
  title?: ReactNode;
  subtitle?: string;
  children: ReactNode;
  padded?: boolean;
}

export function PageShell({ eyebrow, title, subtitle, children, padded = true }: PageShellProps) {
  return (
    <section style={{ padding: padded ? "40px 0 0" : 0 }}>
      {(eyebrow || title || subtitle) && (
        <SectionHeader eyebrow={eyebrow} title={title ?? ""} subtitle={subtitle} />
      )}
      {children}
    </section>
  );
}