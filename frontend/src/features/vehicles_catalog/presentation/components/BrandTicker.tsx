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
import Link from "next/link";
import { Car } from "lucide-react";
import "../styles/brand-ticker.css";

/** Movimiento de puntero por debajo de esto se considera "click", no arrastre. */
const DRAG_CLICK_THRESHOLD = 6;

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
  /** true si el último gesto fue un arrastre (no un tap) — cancela el click
   *  del <Link> para no navegar sin querer al soltar tras arrastrar. */
  const didDragRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoSpeed = reduceMotion ? 0 : AUTO_SPEED;

    const state = {
      offset: 0,
      velocity: -autoSpeed,
      dragging: false,
      hovering: false,
      lastX: 0,
      lastT: 0,
      setWidth: 0,
      dragDistance: 0,
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
        // todo ni pega un salto al terminar un arrastre) — salvo que el
        // mouse esté encima: ahí el objetivo es velocidad 0, para poder
        // apuntar y hacer click en una marca sin que se mueva bajo el cursor.
        const targetVelocity = state.hovering ? 0 : -autoSpeed;
        state.velocity += (targetVelocity - state.velocity) * Math.min(dt * 3, 1);
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
      // OJO: `setPointerCapture` NO se llama acá. Capturar el puntero desde
      // el primer instante redirige también el `click` sintetizado al
      // elemento que capturó (el track), no al <a> que el usuario realmente
      // tocó — un simple tap para navegar a una marca dejaba de funcionar
      // por completo, aunque nunca hubiera arrastre real. Se captura recién
      // en `onPointerMove`, una vez confirmado que sí es un arrastre.
      state.dragging = true;
      state.dragDistance = 0;
      state.lastX = e.clientX;
      state.lastT = performance.now();
      state.velocity = 0;
    }
    function onPointerMove(e: PointerEvent) {
      if (!state.dragging) return;
      const now = performance.now();
      const dx = e.clientX - state.lastX;
      const dtms = Math.max(now - state.lastT, 1);
      state.offset += dx;
      state.dragDistance += Math.abs(dx);
      state.velocity = (dx / dtms) * 1000;
      state.lastX = e.clientX;
      state.lastT = now;

      if (state.dragDistance > DRAG_CLICK_THRESHOLD && !track!.hasPointerCapture(e.pointerId)) {
        track!.setPointerCapture(e.pointerId);
      }
    }
    function onPointerUp(e: PointerEvent) {
      if (!state.dragging) return;
      state.dragging = false;
      // Si movió más que el umbral, fue un arrastre: el click que el
      // navegador dispara justo después de este pointerup no debe navegar.
      didDragRef.current = state.dragDistance > DRAG_CLICK_THRESHOLD;
      state.velocity = Math.max(-MAX_FLING, Math.min(MAX_FLING, state.velocity));
      try {
        if (track!.hasPointerCapture(e.pointerId)) track!.releasePointerCapture(e.pointerId);
      } catch {
        // el puntero ya pudo haberse liberado (pointercancel)
      }
    }

    // `mouseenter`/`mouseleave` (no `pointerenter`): pausar por hover es un
    // gesto de mouse — en touch ya se pausa al arrastrar/tocar.
    function onMouseEnter() {
      state.hovering = true;
    }
    function onMouseLeave() {
      state.hovering = false;
    }

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("mouseenter", onMouseEnter);
    track.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("mouseenter", onMouseEnter);
      track.removeEventListener("mouseleave", onMouseLeave);
      track.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  const items = Array.from({ length: REPEAT }).flatMap(() => BRANDS);

  function handleItemClick(e: React.MouseEvent) {
    if (didDragRef.current) {
      e.preventDefault();
      didDragRef.current = false;
    }
  }

  return (
    <div className="brand-ticker" aria-label="Marcas disponibles">
      <div ref={trackRef} className="brand-ticker__track">
        {items.map((brand, i) => (
          <Link
            key={i}
            href={`/catalogo?brand=${encodeURIComponent(brand)}`}
            className="brand-ticker__item"
            draggable={false}
            onClick={handleItemClick}
          >
            <Car size={14} strokeWidth={1.75} className="brand-ticker__icon" aria-hidden />
            {brand}
          </Link>
        ))}
      </div>
    </div>
  );
}
