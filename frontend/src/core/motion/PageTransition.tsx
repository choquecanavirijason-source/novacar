/**
 * Core · Motion · PageTransition
 * Transición de entrada (fade + slide-up) cada vez que cambia la ruta, para
 * que la navegación no "salte" de una página a otra. Anima el contenedor
 * existente (no lo remonta) al detectar un cambio de pathname. Respeta
 * prefers-reduced-motion.
 */

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
    );
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
