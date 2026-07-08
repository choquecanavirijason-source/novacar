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
  /** Superficie glassmorphism (blur + translucidez) en vez del gradiente sólido. */
  glass?: boolean;
  /** Profundidad 3D: se eleva e inclina sutilmente al pasar el cursor. */
  tilt3d?: boolean;
}

export function Card({ children, className = "", style, animate, glass, tilt3d }: CardProps) {
  const surface = (
    <div
      className={[
        glass ? "glass-panel" : "card",
        tilt3d ? "depth-3d__surface" : "",
        animate ? "animate-in" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children}
    </div>
  );

  return tilt3d ? <div className="depth-3d">{surface}</div> : surface;
}
