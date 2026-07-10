/**
 * Atom · ScrollReveal
 * Revela su contenido (fade + slide-up) cuando entra al viewport, vía
 * IntersectionObserver. Se dispara una sola vez. Respeta reduced-motion (CSS).
 */

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function ScrollReveal({
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
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${visible ? "scroll-reveal--visible" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}
