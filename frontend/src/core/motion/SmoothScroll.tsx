/**
 * Core · Motion · SmoothScroll
 * Monta un scroll con inercia (Lenis) sincronizado con el reloj de GSAP
 * ScrollTrigger, para que todo el parallax/scrub del sitio se asiente al
 * mismo scroll "suavizado" en vez de al nativo del navegador. Se desactiva
 * por completo si el usuario prefiere movimiento reducido. No renderiza UI:
 * es un montaje de efecto único a nivel de layout (ver app/layout.tsx).
 */

"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
