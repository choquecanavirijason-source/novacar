/**
 * Atom · Badge
 * Etiqueta de estado/categoría. Tonos: in (success) | low (warning) | out (danger) | neon.
 */

import type { CSSProperties, ReactNode } from "react";

type Tone = "in" | "low" | "out" | "neon";

const toneStyle: Record<Tone, CSSProperties> = {
  in: { background: "rgba(46, 230, 166, 0.14)", color: "var(--success)" },
  low: { background: "rgba(255, 181, 71, 0.14)", color: "var(--warning)" },
  out: { background: "rgba(255, 93, 115, 0.14)", color: "var(--danger)" },
  neon: { background: "var(--accent-soft)", color: "var(--accent-neon)" },
};

export function Badge({ tone = "neon", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "var(--radius-pill)",
        fontSize: "0.72rem",
        fontWeight: 700,
        ...toneStyle[tone],
      }}
    >
      {children}
    </span>
  );
}
