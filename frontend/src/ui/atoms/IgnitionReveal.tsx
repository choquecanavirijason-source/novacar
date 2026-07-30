/**
 * Atom · IgnitionReveal
 * "Efecto de arranque": al entrar la sección al viewport (una sola vez), el
 * título/eyebrow parpadea como un rótulo de neón encendiéndose mientras el
 * resto del contenido "se arma" (blur + leve inclinación 3D que converge a
 * su lugar). Vía IntersectionObserver + keyframes CSS; respeta
 * prefers-reduced-motion (la regla global ya neutraliza animation-duration).
 */

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function IgnitionReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`ignition-reveal ${visible ? "ignition-reveal--visible" : ""} ${className}`.trim()}>
      <div className="ignition-reveal__content">{children}</div>
    </div>
  );
}
