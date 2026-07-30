/**
 * Atom · CountUp
 * Anima un número de 0 (o del valor previo) hasta `value` cuando entra al
 * viewport (una sola vez). `format` decide cómo se imprime cada frame (ej.
 * moneda). Respeta prefers-reduced-motion (imprime el valor final sin animar).
 */

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CountUp({
  value,
  duration = 1.4,
  format,
  className,
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { n: 0 };
    const render = () => {
      el.textContent = format ? format(obj.n) : Math.round(obj.n).toString();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      obj.n = value;
      render();
      return;
    }

    render();
    const tween = gsap.to(obj, {
      n: value,
      duration,
      ease: "power2.out",
      onUpdate: render,
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, duration, format]);

  return <span ref={ref} className={className} />;
}
