/**
 * Presentation · Component · Testimonials
 * Sección de reseñas de clientes con calificación (prueba social). Carrusel
 * continuo (mismo motor rAF + arrastre que BrandTicker, no Swiper): las
 * tarjetas fluyen sin parar y se pueden arrastrar con el mouse/dedo — con
 * pocas reseñas reales, repetirlas en el track da la sensación de un listado
 * largo en vez de un carrusel corto y evita los cortes de loop de Swiper con
 * pocos slides.
 */

"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { SectionHeader } from "@ui/molecules/SectionHeader";
import { RatingStars } from "@ui/atoms/RatingStars";
import "../styles/home.css";

const REPEAT = 3;
const AUTO_SPEED = 46; // px/s
const MAX_FLING = 1400; // px/s
const TILT_MAX = 38; // deg, inclinación de las tarjetas lejos del centro
const TILT_FALLOFF = 1.6; // en "pasos" de tarjeta, distancia a la que la inclinación llega al máximo

export function Testimonials() {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);

  const reviews = [
    { q: t("testimonials.q1"), n: t("testimonials.n1"), r: t("testimonials.r1"), rating: 5, gradient: "var(--gradient-brand)" },
    { q: t("testimonials.q2"), n: t("testimonials.n2"), r: t("testimonials.r2"), rating: 5, gradient: "var(--gradient-brand-deep)" },
    { q: t("testimonials.q3"), n: t("testimonials.n3"), r: t("testimonials.r3"), rating: 4.5, gradient: "var(--gradient-brand-cool)" },
    { q: t("testimonials.q4"), n: t("testimonials.n4"), r: t("testimonials.r4"), rating: 5, gradient: "var(--gradient-brand)" },
    { q: t("testimonials.q5"), n: t("testimonials.n5"), r: t("testimonials.r5"), rating: 4.5, gradient: "var(--gradient-brand-deep)" },
  ];

  useEffect(() => {
    const track = trackRef.current;
    const container = track?.parentElement;
    if (!track || !container) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoSpeed = reduceMotion ? 0 : AUTO_SPEED;

    const state = {
      offset: 0,
      velocity: -autoSpeed,
      dragging: false,
      lastX: 0,
      lastT: 0,
      setWidth: 0,
      cardStep: 0,
      containerWidth: 0,
    };

    function measure() {
      state.setWidth = track!.scrollWidth / REPEAT;
      state.containerWidth = container!.clientWidth;
      const first = track!.children[0] as HTMLElement | undefined;
      if (first) {
        const gap = parseFloat(getComputedStyle(track!).columnGap || "0") || 0;
        state.cardStep = first.offsetWidth + gap;
      }
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(container);

    let raf = 0;
    let lastTime = performance.now();

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!state.dragging) {
        state.velocity += (-autoSpeed - state.velocity) * Math.min(dt * 3, 1);
        state.offset += state.velocity * dt;
      }

      if (state.setWidth > 0) {
        while (state.offset <= -state.setWidth) state.offset += state.setWidth;
        while (state.offset > 0) state.offset -= state.setWidth;
      }

      track!.style.transform = `translate3d(${state.offset}px, 0, 0)`;

      // Inclinación 3D tipo "coverflow": cada tarjeta se rota según qué tan
      // lejos quede su centro respecto al centro del carrusel — se calcula
      // por matemática (índice × paso de tarjeta), no con getBoundingClientRect,
      // para no forzar un reflow por tarjeta en cada frame.
      if (!reduceMotion && state.cardStep > 0) {
        const centerX = state.containerWidth / 2;
        const children = track!.children;
        for (let i = 0; i < children.length; i++) {
          const card = children[i] as HTMLElement;
          const cardCenter = i * state.cardStep + state.cardStep / 2 + state.offset;
          const norm = Math.max(-1, Math.min(1, (cardCenter - centerX) / (state.cardStep * TILT_FALLOFF)));
          // Curvatura tipo cilindro/esfera: las tarjetas a la izquierda del
          // centro hunden su lado IZQUIERDO hacia atrás (rotateY negativo),
          // las de la derecha hunden su lado derecho — como si todas
          // estuvieran pegadas al borde de un carrusel circular visto desde
          // afuera, no giradas "en espejo" una respecto a la otra.
          const rotate = norm * TILT_MAX;
          const scale = 1 - Math.abs(norm) * 0.12;
          const depth = -Math.abs(norm) * 70;
          card.style.transform = `perspective(1200px) translateZ(${depth}px) rotateY(${rotate}deg) scale(${scale})`;
          card.style.zIndex = String(Math.round((1 - Math.abs(norm)) * 100));
        }
      }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews.length]);

  const items = Array.from({ length: REPEAT }).flatMap(() => reviews);

  return (
    <section style={{ padding: "32px 0 64px" }}>
      <SectionHeader
        eyebrow={t("testimonials.eyebrow")}
        title={t("testimonials.title")}
        subtitle={t("testimonials.subtitle")}
        align="center"
      />

      <div className="testi-marquee">
        <div ref={trackRef} className="testi-marquee__track">
          {items.map((rv, i) => (
            <div key={`${rv.n}-${i}`} className="testi-hud-card group">
              <div className="testi-hud-card__border" aria-hidden />

              <span className="testi-hud-card__quote" aria-hidden>
                &ldquo;
              </span>
              <blockquote className="testi-hud-card__text">{rv.q}</blockquote>

              <div className="testi-hud-card__footer">
                <span className="testi-hud-card__avatar" style={{ background: rv.gradient }}>
                  {rv.n.charAt(0)}
                </span>
                <span className="testi-hud-card__identity">
                  <span className="testi-hud-card__name">{rv.n}</span>
                  <span className="testi-hud-card__role">{rv.r}</span>
                </span>
                <span className="testi-hud-card__rating">
                  <RatingStars value={rv.rating} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
