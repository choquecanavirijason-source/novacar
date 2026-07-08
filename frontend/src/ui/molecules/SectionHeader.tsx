/**
 * Molecule · SectionHeader
 * Encabezado de sección: eyebrow + título (con highlight opcional) + subtítulo.
 */

import type { ReactNode } from "react";
import { Eyebrow } from "../atoms/Eyebrow";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeader({ eyebrow, title, subtitle, align = "left" }: SectionHeaderProps) {
  return (
    <header style={{ textAlign: align, marginBottom: 24 }}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: eyebrow ? 12 : 0 }}>{title}</h2>
      {subtitle && (
        <p style={{ color: "var(--text-secondary)", marginTop: 8, maxWidth: 620 }}>{subtitle}</p>
      )}
    </header>
  );
}
