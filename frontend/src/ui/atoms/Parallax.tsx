/**
 * Atom · Parallax
 * Capa decorativa con profundidad de scroll: se desplaza en Y una fracción
 * (`speed`) de su propio alto mientras cruza el viewport, atada al scrubbing
 * de GSAP ScrollTrigger (no al tiempo/duración) para que quede pegada al
 * dedo/rueda del usuario. Solo anima `transform` (GPU, sin reflow). Pensada
 * para imágenes/marcas de agua de fondo — no envolver contenido interactivo,
 * ya que reposiciona visualmente su contenido mientras se hace scroll.
 * Respeta prefers-reduced-motion (no anima nada si está activo).
 */

"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Parallax({
  children,
  speed = 0.15,
  className = "",
}: {
  children: ReactNode;
  /** Fracción del alto propio a desplazar (negativo = sube, positivo = baja). */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.to(ref.current, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    },
    { scope: ref, dependencies: [speed] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
