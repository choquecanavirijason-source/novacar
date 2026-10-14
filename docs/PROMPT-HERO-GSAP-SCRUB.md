# Prompt — Hero scrollytelling con video escrubeado (GSAP + ScrollTrigger)

> Prompt reutilizable para replicar la técnica de `HeroShowcase.tsx`.
> Reemplaza los `[corchetes]` por tus valores antes de enviarlo.

---

Actúa como un Senior Frontend / Motion Engineer especializado en Next.js 16 (App Router),
React 19, TypeScript strict y animación con GSAP 3 (ScrollTrigger + @gsap/react).

Quiero implementar una sección hero de "scrollytelling" con VIDEO ESCRUBEADO POR SCROLL
para: [NOMBRE DE LA SECCIÓN / PRODUCTO, ej: "hero de la landing", "reveal del motor"].

## Contexto del proyecto (respétalo, no lo cambies)

- Next.js 16 App Router + React 19 + TypeScript `strict: true`.
- GSAP 3 con `@gsap/react` (`useGSAP`) y `ScrollTrigger`. Registrar:
  `gsap.registerPlugin(ScrollTrigger, useGSAP)`.
- **Lenis ya está sincronizado globalmente con ScrollTrigger** (capa `core/motion`).
  Por lo tanto: NO instales otro smooth-scroll y NO uses scrub numérico.
- Estilos: archivo CSS propio del módulo (`../styles/<nombre>.css`) usando tokens `:root`
  del design system. Sin CSS-in-JS, sin colores hardcodeados.
- Todo texto visible pasa por `t("clave")` del provider de i18n.
- Es un Client Component: primera línea `"use client"`.
- Iconos: `lucide-react`.

## Assets y parámetros

- Clip 1: `[/ruta/clip-1.mp4]`, duración real `[10]` s.
  Los primeros `[1.8]` s son una toma de establecimiento que quiero SALTAR:
  el reposo inicial y el arranque del scrub empiezan ya en el plano cerrado.
- Clip 2: `[/ruta/clip-2.mp4]`, duración real `[10]` s, pero solo son usables
  los primeros `[5]` s (después el material fuente hace una transición rara):
  nunca escrubees más allá de ese tope.
- Largo del recorrido de scroll: `[3]` alturas de viewport (más alto = más cinemático).

## Entregables — genera CADA UNO completo, sin resumir y sin comentarios tipo "// aquí tu código"

1. **Bloque de constantes** al inicio del archivo (fuera del componente): duraciones,
   recorte del clip 1, tope del clip 2, duración usable total, punto de corte
   proporcional entre ambos clips (`SPLIT`), multiplicador de vh del scroll, ventana y
   ciclo del loop de descanso, delay de inactividad y tiempo mínimo del loader.
   Cero números mágicos dentro de la lógica.

2. **Detección de `prefers-reduced-motion`** en estado, resuelta en `useEffect`
   (no en el render, para no romper la hidratación).

3. **Seek inicial robusto del clip 1** hasta el frame de arranque recortado.

4. **Progreso de carga real + loader de marca**: porcentaje calculado con
   `buffered.end(...) / duration` de ambos clips promediados (NO una barra falsa
   animada por tiempo), más un tiempo mínimo visible del loader para que la animación
   de marca alcance a apreciarse en conexiones rápidas. El hero se revela solo cuando
   `videosReady && loaderElapsed`.

5. **UN ÚNICO `ScrollTrigger`** creado dentro de `useGSAP`, con `pin: true`,
   `anticipatePin: 1`, `start: "top top"`, `end` calculado en función de
   `window.innerHeight * MULTIPLICADOR` (como callback, para que recalcule en resize)
   y `scrub: true`. En `onUpdate`, repartir `self.progress` entre los dos clips de forma
   proporcional a su duración usable y escribir `currentTime`; cruzar del clip 1 al 2
   con un fundido corto de opacidad.

6. **Fundidos derivados del mismo progreso, con matemática simple** (sin timelines ni
   ScrollTriggers anidados): el copy inicial sale en el primer ~22 %, el hint de scroll
   sale en el primer ~6 %, y el copy de cierre entra en el último ~14 % sobre el frame
   final. Opacidad + `translateY` escritos directamente en el nodo por ref.

7. **Loop de descanso ("cinemagraph")**: cuando el usuario llega al final del recorrido
   y se queda quieto ~500 ms, en vez de dejar el frame congelado, mecer el clip 2 entre
   sus últimos ~1.6 s con `requestAnimationFrame` y una onda coseno `0→1→0` (ping-pong
   suave, sin corte en los extremos). Debe cancelarse en cuanto el usuario vuelve a
   scrollear, y debe auto-detenerse si la sección ya no está pineada.

8. **Limpieza completa**: `cancelAnimationFrame`, `clearTimeout`, `clearInterval`,
   `trigger.kill()` y remoción de listeners, devueltos desde el callback de `useGSAP`
   (con `scope` y `dependencies`) y desde cada `useEffect`.

9. **JSX**: capa de video (posicionada, `object-fit: cover`), scrim/degradado de
   legibilidad, copy inicial (h1 a dos líneas, descripción, CTAs), copy de cierre,
   hint de scroll y overlay del loader. Todos los `<video>` con
   `muted playsInline preload="auto"` y la capa decorativa con `aria-hidden`.
   El loader con `role="status"` y `aria-live="polite"`.

10. **CSS del módulo**: pin sin salto de layout (`height: 100vh`, `overflow: hidden`),
    video absoluto a pantalla completa, scrim con degradado desde tokens, tipografía con
    tracking negativo en el título, y la animación del loader. Solo animar `opacity` y
    `transform`.

## Reglas obligatorias de implementación

- **Un solo ScrollTrigger** para todo. Nada de un trigger por elemento.
- **`scrub: true`, nunca numérico** (`scrub: 0.5` y similares): el scroll ya viene
  suavizado por Lenis y una segunda capa de suavizado se siente lagueada, sobre todo
  en video.
- **Guard de seek de 1 frame**: antes de asignar `currentTime`, comparar contra el valor
  actual y salir si la diferencia es menor a `1/30`. Reasignar `currentTime` fuerza una
  re-decodificación, y el scroll dispara muchos más updates por segundo que los fps del
  video: sin este guard la mayoría de los seeks son redundantes y se ve a tirones.
- **Nada de `state` dentro de `onUpdate`**: escribir directo en el DOM vía refs.
  Un `setState` por frame de scroll mata el rendimiento.
- **Animar solo `opacity` y `transform`.** Prohibido animar `width`, `height`, `margin`,
  `padding`, `top`/`left` o cualquier propiedad que provoque reflow.
- **`prefers-reduced-motion: reduce`**: no montar el pin, ni el scrub, ni el loader, ni
  el segundo clip. Caer al mismo copy sobre el frame estático de arranque, sin ningún
  movimiento ligado al scroll.
- **Sin librerías nuevas.** Solo GSAP, ScrollTrigger y `@gsap/react`.
- **Comenta el POR QUÉ, no el qué.** Cada decisión no obvia (el recorte, el tope, el
  guard de frame, el sondeo, la onda coseno) lleva un comentario que explique la razón.
- TypeScript estricto: refs tipadas (`useRef<HTMLVideoElement>(null)`), sin `any`,
  sin `!` para silenciar el compilador — guardas explícitas de null.

## Gotchas que DEBES resolver explícitamente (es la parte difícil, no la omitas)

1. **El seek inicial se pierde por timing.** Un video local puede terminar de cargar y
   disparar `loadedmetadata` antes de que React hidrate y enganche el listener. Resuélvelo
   sondeando hasta que `readyState >= 1` y pidiendo el seek **una sola vez**: reasignar
   `currentTime` en cada tick reinicia el seek en curso y el video nunca se asienta.
2. **No uses `loadeddata` para detectar "listo".** Ese evento dispara una sola vez para
   la posición inicial, y el seek de recorte puede impedir que vuelva a dispararse para
   la nueva posición: el loader se traba en 0 % para siempre. Sondea `readyState >= 2`.
3. **Arranque en frío del dev server.** El bundler puede seguir compilando la ruta cuando
   el `<video>` pide el archivo: la petición falla con error de red y el loader queda
   esperando indefinidamente. Escucha `error` y reintenta `v.load()` tras un breve delay.
4. **Failsafe.** Si pasados ~8 s los videos siguen sin cargar por cualquier motivo, revela
   el hero igual. Nunca dejes la sección bloqueada de forma permanente.
5. **El loop de descanso no se entera de que la sección se despinneó.** Si el usuario
   scrollea lejos, `onUpdate` no vuelve a dispararse para detenerlo y el video sigue
   "respirando" fuera de pantalla. Chequea `trigger.isActive` dentro del `rAF` y córtalo.
6. **`end` como función.** Calcúlalo con un callback para que sobreviva a los resize;
   una constante congelada rompe el recorrido al rotar el dispositivo.

## Cierre

Al final, en máximo 5 líneas, explícame qué constantes tocar para: hacer el scrub más
lento, mover el punto donde entra el copy de cierre, y cambiar el recorte de los clips.

---

## Variante: secuencia de imágenes en vez de video

Si el material es `frame-0001.webp … frame-0240.webp`, cambia el entregable 5 por
"precargar los N frames y pintar en un `<canvas>` el frame `round(progress * (N-1))`".
El resto del prompt (un solo trigger, guard para no repintar el mismo frame, loop de
descanso, `prefers-reduced-motion`, failsafe) aplica igual.
