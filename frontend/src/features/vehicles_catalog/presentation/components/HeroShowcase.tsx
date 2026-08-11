/**
 * Presentation · Component · HeroShowcase
 * Hero "scrollytelling": una sección fija (pin) donde el scroll del usuario
 * escrubea dos clips de video (public/hero-gsap/) en vez de reproducirlos
 * por tiempo — técnica clásica de reveal cinematográfico de producto
 * (Apple/automotrices). El clip 1 salta sus primeros ~1.8s (toma ancha de
 * establecimiento) y arranca directo en el plano cerrado 3/4. El clip 2 se
 * limita a sus primeros 5s: después de ese punto el material fuente hace un
 * salto/transición extraña.
 *
 * Mecánica (ver useGSAP más abajo):
 *  - Un solo ScrollTrigger con pin+scrub controla currentTime de ambos
 *    <video> según el progreso de scroll (0..1), repartido proporcional a
 *    la duración usable de cada clip (8.2s + 5s → ~62%/38% del recorrido).
 *  - El mismo progreso maneja, con matemática simple (sin triggers
 *    anidados), el fundido de: el copy inicial (sale en el primer 22%), el
 *    hint de scroll (sale en el primer 6%) y el copy de cierre (entra en
 *    el último 14%, sobre el frame final del clip 2).
 *  - Al llegar al final y quedarse quieto (~500ms sin scroll), un loop
 *    "cinemagraph" (rAF, ping-pong suave con coseno) mece el clip 2 entre
 *    sus últimos ~1.6s en vez de dejarlo congelado — se cancela en cuanto
 *    el usuario vuelve a mover el scroll.
 *  - Mientras los videos cargan, un loader estilo "arranque de carreras"
 *    (tacómetro + bandera a cuadros) cubre el hero con progreso real
 *    (bytes bufferizados / duración), no una barra falsa.
 *  - gsap.context() vía useGSAP evita fugas de memoria; Lenis ya está
 *    sincronizado con ScrollTrigger a nivel global (ver core/motion).
 *  - prefers-reduced-motion: no monta video, loader ni pin — cae a una
 *    imagen estática con el mismo copy, sin ningún movimiento ligado al scroll.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown, Gauge } from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Button } from "@ui/atoms/Button";
import "../styles/hero-showcase.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PART1_SRC = "/hero-gsap/hero-part-1.mp4";
const PART2_SRC = "/hero-gsap/hero-part-2.mp4";
const PART1_DURATION = 10;
/** Los primeros ~1.8s del clip 1 son una toma ancha de establecimiento — se
 *  saltan por completo. El hero (reposo y arranque del scrub) empieza directo
 *  en el plano cerrado 3/4 delantero. */
const PART1_START = 1.8;
const PART1_USABLE = PART1_DURATION - PART1_START;
/** Tope pedido: el clip 2 dura 10s en el archivo, pero pasado el segundo 5 hace una transición rara — nunca escrubeamos más allá de esto. */
const PART2_DURATION = 5;
const TOTAL_DURATION = PART1_USABLE + PART2_DURATION;
const SPLIT = PART1_USABLE / TOTAL_DURATION;
/** "Longitud" del scrub en alturas de viewport — más alto = scrub más lento/cinemático. */
const SCROLL_VH_MULTIPLIER = 3;
/** Ventana del loop de descanso: los últimos N segundos del clip 2. */
const REST_LOOP_WINDOW = 1.6;
const REST_LOOP_CYCLE_MS = 2600;
const REST_IDLE_DELAY_MS = 500;

export function HeroShowcase() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const restRaf = useRef<number | null>(null);
  const restTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [videosReady, setVideosReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // El video arranca por defecto en su frame 0 (la toma ancha) — lo saltamos a
  // PART1_START para que el reposo inicial ya muestre el plano cerrado. Un
  // video local puede terminar de cargar (y disparar loadedmetadata) antes de
  // que React hidrate y llegue a engancharse, así que en vez de depender de un
  // único evento, reafirmamos el seek por unos instantes hasta que se sostenga.
  useEffect(() => {
    const v1 = video1Ref.current;
    if (!v1) return;
    let settled = false;
    const trySeek = () => {
      if (settled || v1.currentTime >= PART1_START) {
        settled = true;
        return;
      }
      if (v1.readyState >= 1) v1.currentTime = PART1_START;
    };
    trySeek();
    const id = window.setInterval(trySeek, 60);
    const stop = window.setTimeout(() => {
      settled = true;
      window.clearInterval(id);
    }, 2000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, []);

  // El loader solo debe verse si la carga tarda de verdad — en local/banda ancha
  // los clips están listos casi al instante y mostrarlo igual sería un flash
  // molesto tapando el primer frame del hero. Se retrasa su aparición; si
  // videosReady llega antes, nunca llega a montarse.
  useEffect(() => {
    if (reducedMotion || videosReady) return;
    const id = setTimeout(() => setShowLoader(true), 350);
    return () => clearTimeout(id);
  }, [reducedMotion, videosReady]);

  // Carga + progreso real (bytes bufferizados / duración) para el loader.
  useEffect(() => {
    if (reducedMotion) return;
    const videos = [video1Ref.current, video2Ref.current].filter((v): v is HTMLVideoElement => v != null);
    if (videos.length < 2) return;

    const perVideo = [0, 0];
    let loadedCount = 0;
    const cleanups: Array<() => void> = [];

    const reportProgress = (i: number, v: HTMLVideoElement) => {
      try {
        if (v.buffered.length > 0 && v.duration) {
          perVideo[i] = Math.min(100, (v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
          setLoadProgress((perVideo[0] + perVideo[1]) / 2);
        }
      } catch {
        // Rango de buffer no disponible todavía — se ignora, llegará el próximo evento.
      }
    };

    const markLoaded = () => {
      loadedCount += 1;
      if (loadedCount >= videos.length) {
        setLoadProgress(100);
        setVideosReady(true);
      }
    };

    videos.forEach((v, i) => {
      const onProgress = () => reportProgress(i, v);
      v.addEventListener("progress", onProgress);
      cleanups.push(() => v.removeEventListener("progress", onProgress));

      if (v.readyState >= 2) {
        markLoaded();
      } else {
        const onReady = () => markLoaded();
        v.addEventListener("loadeddata", onReady);
        cleanups.push(() => v.removeEventListener("loadeddata", onReady));
      }
    });

    return () => cleanups.forEach((fn) => fn());
  }, [reducedMotion]);

  useGSAP(
    () => {
      if (!videosReady || reducedMotion) return;
      const section = sectionRef.current;
      const v1 = video1Ref.current;
      const v2 = video2Ref.current;
      if (!section || !v1 || !v2) return;

      v1.pause();
      v2.pause();
      v2.style.opacity = "0";

      const stopRestLoop = () => {
        if (restRaf.current !== null) {
          cancelAnimationFrame(restRaf.current);
          restRaf.current = null;
        }
      };

      const startRestLoop = () => {
        stopRestLoop();
        const loopStart = PART2_DURATION - REST_LOOP_WINDOW;
        const beginTs = performance.now();

        const tick = (now: number) => {
          const elapsed = (now - beginTs) % REST_LOOP_CYCLE_MS;
          // Onda coseno 0→1→0: mecido suave, sin corte brusco en los extremos.
          const wave = (1 - Math.cos((elapsed / REST_LOOP_CYCLE_MS) * Math.PI * 2)) / 2;
          v2.currentTime = loopStart + wave * REST_LOOP_WINDOW;
          restRaf.current = requestAnimationFrame(tick);
        };
        restRaf.current = requestAnimationFrame(tick);
      };

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${window.innerHeight * SCROLL_VH_MULTIPLIER}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;

          stopRestLoop();
          if (restTimeout.current) clearTimeout(restTimeout.current);

          if (p <= SPLIT) {
            v1.currentTime = PART1_START + (p / SPLIT) * PART1_USABLE;
            v2.style.opacity = "0";
          } else {
            const localP = Math.min((p - SPLIT) / (1 - SPLIT), 1);
            v2.currentTime = localP * PART2_DURATION;
            v2.style.opacity = String(Math.min((p - SPLIT) / 0.03, 1));

            // Llegamos al final del recorrido: si el usuario se queda quieto
            // ahí, en vez de dejar el frame congelado arrancamos el
            // cinemagraph de descanso.
            if (p >= 0.995) {
              restTimeout.current = setTimeout(startRestLoop, REST_IDLE_DELAY_MS);
            }
          }

          if (copyRef.current) {
            const visible = 1 - Math.min(p / 0.22, 1);
            copyRef.current.style.opacity = String(visible);
            copyRef.current.style.transform = `translateY(${-24 * (1 - visible)}px)`;
          }

          if (hintRef.current) {
            hintRef.current.style.opacity = String(1 - Math.min(p / 0.06, 1));
          }

          if (outroRef.current) {
            const visible = Math.max(0, (p - 0.86) / 0.14);
            outroRef.current.style.opacity = String(visible);
            outroRef.current.style.transform = `translateY(${24 * (1 - visible)}px)`;
          }
        },
      });

      return () => {
        stopRestLoop();
        if (restTimeout.current) clearTimeout(restTimeout.current);
        trigger.kill();
      };
    },
    { scope: sectionRef, dependencies: [videosReady, reducedMotion] },
  );

  return (
    <section ref={sectionRef} className="hero-scrub">
      <div className="hero-scrub__video-layer" aria-hidden>
        {/* prefers-reduced-motion: se renderiza el mismo video pero sin pin/scrub — queda
            quieto en PART1_START (ver useGSAP arriba, que no monta el ScrollTrigger en
            ese caso), en vez de depender de una foto estática aparte. */}
        <video ref={video1Ref} className="hero-scrub__video" src={PART1_SRC} muted playsInline preload="auto" />
        {!reducedMotion && (
          <video
            ref={video2Ref}
            className="hero-scrub__video hero-scrub__video--2"
            src={PART2_SRC}
            muted
            playsInline
            preload="auto"
          />
        )}
        <div className="hero-scrub__scrim" />
      </div>

      <div className="hero-scrub__inner container">
        <div ref={copyRef} className="hero-scrub__copy">
          <h1 className="hero-scrub__title">
            <span className="hero-scrub__title-line hero-scrub__title-line--metal">{t("hero2.titleTop")}</span>
            <span className="hero-scrub__title-line hero-scrub__title-line--accent">{t("hero2.titleBottom")}</span>
          </h1>

          <p className="hero-scrub__desc">{t("hero2.desc")}</p>

          <div className="hero-scrub__gauge">
            <Gauge size={16} strokeWidth={1.75} aria-hidden />
            <span>{t("hero2.gauge")}</span>
          </div>

          <div className="hero-scrub__actions">
            <Button href="/catalogo">{t("hero.ctaCars")}</Button>
            <Button href="/autopartes" variant="ghost">
              {t("hero.ctaParts")}
            </Button>
          </div>
        </div>

        {!reducedMotion && (
          <div ref={outroRef} className="hero-scrub__outro">
            <span className="hero-scrub__outro-glow" aria-hidden />
            <span className="hero-scrub__outro-eyebrow">{t("hero2.outroEyebrow")}</span>
            <Button href="/catalogo">{t("hero.ctaCars")}</Button>
          </div>
        )}
      </div>

      {!reducedMotion && (
        <div ref={hintRef} className="hero-scrub__hint">
          <span>{t("hero2.scrollHint")}</span>
          <ChevronDown size={16} strokeWidth={2} aria-hidden />
        </div>
      )}

      {!reducedMotion && showLoader && !videosReady && (
        <div className="hero-scrub__loader" role="status" aria-live="polite">
          <div className="hero-scrub__loader-flag hero-scrub__loader-flag--top" aria-hidden />

          <div className="hero-scrub__loader-body">
            <span className="hero-scrub__loader-eyebrow">NOVACAR</span>
            <h2 className="hero-scrub__loader-title">{t("hero2.loaderTitle")}</h2>

            <div className="hero-scrub__loader-tacho">
              <div className="hero-scrub__loader-tacho-ticks" aria-hidden />
              <div className="hero-scrub__loader-tacho-fill" style={{ width: `${loadProgress}%` }} />
            </div>

            <div className="hero-scrub__loader-meta">
              <span>{t("hero2.loaderHint")}</span>
              <span className="hero-scrub__loader-pct">{Math.round(loadProgress).toString().padStart(2, "0")}%</span>
            </div>
          </div>

          <div className="hero-scrub__loader-flag hero-scrub__loader-flag--bottom" aria-hidden />
        </div>
      )}
    </section>
  );
}
