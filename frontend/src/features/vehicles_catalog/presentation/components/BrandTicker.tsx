/**
 * Presentation · Component · BrandTicker
 * Franja horizontal debajo del Hero con las marcas disponibles en el
 * catálogo. Se mueve sola de forma continua (nunca se detiene del todo) y
 * también se puede arrastrar con el mouse/dedo — al soltar, retoma el
 * autoscroll con una leve inercia en vez de saltar de golpe. Animado por
 * rAF con `translate3d` (sin recalcular layout) en vez de una animación CSS
 * fija, para poder combinar drag + autoscroll sin conflictos.
 */

"use client";

import { useEffect, useRef } from "react";
import { Car } from "lucide-react";
import "../styles/brand-ticker.css";

const BRANDS = [
  "Nissan",
  "Volkswagen",
  "Toyota",
  "Tesla",
  "Honda",
  "BMW",
  "Mazda",
  "Chevrolet",
  "Ford",
  "Hyundai",
  "Kia",
];

const REPEAT = 4;
const AUTO_SPEED = 36; // px/s, deriva constante hacia la izquierda
const MAX_FLING = 900; // px/s, límite de velocidad al soltar tras un arrastre rápido

export function BrandTicker() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoSpeed = reduceMotion ? 0 : AUTO_SPEED;

    const state = {
      offset: 0,
      velocity: -autoSpeed,
      dragging: false,
      lastX: 0,
      lastT: 0,
      setWidth: 0,
    };

    function measure() {
      state.setWidth = track!.scrollWidth / REPEAT;
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    let raf = 0;
    let lastTime = performance.now();

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!state.dragging) {
        // Vuelve suavemente a la velocidad base (nunca se queda quieta del
        // todo ni pega un salto al terminar un arrastre).
        state.velocity += (-autoSpeed - state.velocity) * Math.min(dt * 3, 1);
        state.offset += state.velocity * dt;
      }

      if (state.setWidth > 0) {
        while (state.offset <= -state.setWidth) state.offset += state.setWidth;
        while (state.offset > 0) state.offset -= state.setWidth;
      }

      track!.style.transform = `translate3d(${state.offset}px, 0, 0)`;
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function onPointerDown(e: PointerEvent) {
      state.dragging = true;
      state.lastX = e.clientX;
      state.lastT = performance.now();
      state.velocity = 0;
      track!.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e: PointerEvent) {
      if (!state.dragging) return;
      const now = performance.now();
      const dx = e.clientX - state.lastX;
      const dtms = Math.max(now - state.lastT, 1);
      state.offset += dx;
      state.velocity = (dx / dtms) * 1000;
      state.lastX = e.clientX;
      state.lastT = now;
    }
    function onPointerUp(e: PointerEvent) {
      if (!state.dragging) return;
      state.dragging = false;
      state.velocity = Math.max(-MAX_FLING, Math.min(MAX_FLING, state.velocity));
      try {
        track!.releasePointerCapture(e.pointerId);
      } catch {
        // el puntero ya pudo haberse liberado (pointercancel)
      }
    }

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  const items = Array.from({ length: REPEAT }).flatMap(() => BRANDS);

  return (
    <div className="brand-ticker" aria-label="Marcas disponibles">
      <div ref={trackRef} className="brand-ticker__track">
        {items.map((brand, i) => (
          <span key={i} className="brand-ticker__item">
            <Car size={14} strokeWidth={1.75} className="brand-ticker__icon" aria-hidden />
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
