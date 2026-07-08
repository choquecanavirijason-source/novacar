/**
 * Atom · Chip
 * Píldora seleccionable para filtros y opciones.
 */

"use client";

import type { ReactNode } from "react";

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  "aria-label"?: string;
}

export function Chip({ active, onClick, children, ...aria }: ChipProps) {
  return (
    <button
      type="button"
      className={`chip ${active ? "chip--active" : ""}`}
      aria-pressed={active}
      onClick={onClick}
      {...aria}
    >
      {children}
    </button>
  );
}
