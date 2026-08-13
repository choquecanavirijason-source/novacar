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
/** El loader (tacómetro + bandera a cuadros) siempre se ve al menos esto,
 *  aunque los videos ya estén listos — así la animación de marca alcanza a
 *  apreciarse incluso en banda ancha, en vez de ser un flash de 100ms. */
const MIN_LOADER_MS = 900;

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
  const [loaderElapsed, setLoaderElapsed] = useState(false);
  const heroReady = videosReady && loaderElapsed;

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // El video arranca por defecto en su frame 0 (la toma ancha) — lo saltamos a
  // PART1_START para que el reposo inicial ya muestre el plano cerrado. Un
  // video local puede terminar de cargar (y disparar loadedmetadata) antes de
  // que React hidrate y llegue a engancharse, así que sondeamos hasta que
  // haya metadata (readyState >= 1) para recién ahí pedir el seek — UNA sola
  // vez: reasignar `currentTime` en cada tick (aunque sea al mismo valor)
  // reinicia el seek en curso una y otra vez y el video nunca termina de
  // asentarse.
  useEffect(() => {
    const v1 = video1Ref.current;
    if (!v1) return;
    let done = false;
    const trySeek = () => {
      if (done || v1.readyState < 1) return;
      done = true;
      v1.currentTime = PART1_START;
    };
    trySeek();
    const id = window.setInterval(trySeek, 60);
    const stop = window.setTimeout(() => window.clearInterval(id), 2000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, []);

  // Tiempo mínimo de marca: el loader se ve al menos MIN_LOADER_MS aunque
  // los videos carguen casi al instante (ver heroReady = videosReady && loaderElapsed).
  useEffect(() => {
    if (reducedMotion) return;
    const id = setTimeout(() => setLoaderElapsed(true), MIN_LOADER_MS);
    return () => clearTimeout(id);
  }, [reducedMotion]);

  // Carga + progreso real (bytes bufferizados / duración) para el loader.
  // Sondea `readyState` en vez de escuchar `loadeddata`: ese evento dispara
  // una sola vez para la posición de reproducción inicial, y el seek del
  // efecto anterior (saltar a PART1_START) puede hacer que el navegador no
  // vuelva a dispararlo nunca para la nueva posición — con el listener nos
  // quedábamos esperando un evento que ya no llegaba y el loader se trababa
  // en 0% para siempre. Sondear el estado directamente es inmune a eso.
  useEffect(() => {
    if (reducedMotion) return;
    const videos = [video1Ref.current, video2Ref.current].filter((v): v is HTMLVideoElement => v != null);
    if (videos.length < 2) return;

    const perVideo = [0, 0];
    const loaded = videos.map(() => false);
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

    // En el primer arranque en frío de `npm run dev`, Turbopack puede seguir
    // compilando la ruta cuando el <video> pide el archivo — la petición
    // falla (network error) y sin manejarlo el loader se queda esperando
    // para siempre (hay que refrescar a mano). Reintentamos la carga sola.
    videos.forEach((v, i) => {
      const onProgress = () => reportProgress(i, v);
      v.addEventListener("progress", onProgress);
      cleanups.push(() => v.removeEventListener("progress", onProgress));

      const onError = () => {
        if (loaded[i]) return;
        window.setTimeout(() => v.load(), 400);
      };
      v.addEventListener("error", onError);
      cleanups.push(() => v.removeEventListener("error", onError));
    });

    const pollId = window.setInterval(() => {
      videos.forEach((v, i) => {
        if (!loaded[i] && v.readyState >= 2) loaded[i] = true;
      });
      if (loaded.every(Boolean)) {
        setLoadProgress(100);
        setVideosReady(true);
        window.clearInterval(pollId);
      }
    }, 120);
    cleanups.push(() => window.clearInterval(pollId));

    // Red de seguridad: si después de todo (compilación lenta, red rara,
    // algo que no anticipamos) los videos no cargan, no dejamos el hero
    // trabado para siempre — se revela igual pasado este máximo.
    const failsafe = window.setTimeout(() => {
      setLoadProgress(100);
      setVideosReady(true);
    }, 8000);
    cleanups.push(() => window.clearTimeout(failsafe));

    return () => cleanups.forEach((fn) => fn());
  }, [reducedMotion]);

  useGSAP(
    () => {
      if (!heroReady || reducedMotion) return;
      const section = sectionRef.current;
      const v1 = video1Ref.current;
      const v2 = video2Ref.current;
      if (!section || !v1 || !v2) return;

      v1.pause();
      v2.pause();
      v2.style.opacity = "0";

      // Reasignar `currentTime` fuerza al navegador a re-decodificar, aunque
      // el cambio sea de una fracción de frame — con el scroll disparando
      // muchos más updates por segundo que los ~30fps del video, la mayoría
      // de esos seeks son redundantes y generan tirones. Saltarlos por
      // debajo de 1 frame evita el trabajo sin perder fluidez visual.
      const MIN_SEEK_DELTA = 1 / 30;
      const seekTo = (v: HTMLVideoElement, time: number) => {
        if (Math.abs(v.currentTime - time) >= MIN_SEEK_DELTA) v.currentTime = time;
      };

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
          // Si el usuario ya scrolleó lejos del hero (se despinneó), `onUpdate`
          // no vuelve a disparar para detener el loop — sin este chequeo, el
          // video seguía "respirando" para siempre aunque la sección ya no
          // estuviera pineada ni a la vista.
          if (!trigger.isActive) {
            stopRestLoop();
            return;
          }
          const elapsed = (now - beginTs) % REST_LOOP_CYCLE_MS;
          // Onda coseno 0→1→0: mecido suave, sin corte brusco en los extremos.
          const wave = (1 - Math.cos((elapsed / REST_LOOP_CYCLE_MS) * Math.PI * 2)) / 2;
          seekTo(v2, loopStart + wave * REST_LOOP_WINDOW);
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
        // El scroll ya llega suavizado por Lenis (ver core/motion/SmoothScroll) —
        // agregar otra capa de scrub con retardo aquí encima duplica el
        // suavizado y se siente lagueado, sobre todo en video (muy sensible a
        // cualquier delay). `true` sigue 1:1 la posición ya suavizada.
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;

          stopRestLoop();
          if (restTimeout.current) clearTimeout(restTimeout.current);

          if (p <= SPLIT) {
            seekTo(v1, PART1_START + (p / SPLIT) * PART1_USABLE);
            v2.style.opacity = "0";
          } else {
            const localP = Math.min((p - SPLIT) / (1 - SPLIT), 1);
            seekTo(v2, localP * PART2_DURATION);
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
    { scope: sectionRef, dependencies: [heroReady, reducedMotion] },
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

      {!reducedMotion && !heroReady && (
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
