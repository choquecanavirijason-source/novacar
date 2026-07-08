/**
 * Atom · Card
 * Superficie elevada base del sistema de diseño.
 */

import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  animate?: boolean;
}

export function Card({ children, className = "", style, animate }: CardProps) {
  return (
    <div className={`card ${animate ? "animate-in" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}
