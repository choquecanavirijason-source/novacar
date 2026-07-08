/**
 * Template · Section
 * Envoltura estándar de sección con padding vertical consistente.
 */

import type { ReactNode } from "react";

type SectionSize = "sm" | "md" | "lg";

interface SectionProps {
  children: ReactNode;
  id?: string;
  size?: SectionSize;
  className?: string;
  "aria-labelledby"?: string;
}

const sizeClass: Record<SectionSize, string> = {
  sm: "tpl-section tpl-section--sm",
  md: "tpl-section",
  lg: "tpl-section tpl-section--lg",
};

export function Section({ children, id, size = "md", className = "", ...rest }: SectionProps) {
  return (
    <section id={id} className={`${sizeClass[size]} ${className}`.trim()} {...rest}>
      {children}
    </section>
  );
}