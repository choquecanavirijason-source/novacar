/**
 * Atom · TypewriterText
 * Revela un texto letra por letra cuando entra al viewport (una sola vez),
 * como si se estuviera "cargando". Respeta prefers-reduced-motion (imprime
 * el texto completo sin animar). El texto completo siempre está disponible
 * para lectores de pantalla vía `aria-label`; la animación queda oculta a
 * tecnología asistiva.
 */

"use client";

import { useEffect, useRef, useState } from "react";

export function TypewriterText({
  text,
  speed = 28,
  className,
}: {
  text: string;
  /** ms entre cada letra. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [started, text, speed]);

  const done = count >= text.length;

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {started && !done && (
          <span className="typewriter-cursor" aria-hidden="true">
            |
          </span>
        )}
      </span>
    </span>
  );
}
