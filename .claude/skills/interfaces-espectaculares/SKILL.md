---
name: interfaces-espectaculares
description: >
  Skill maestro para crear interfaces web espectaculares, memorables y de nivel agencia.
  Orquesta las skills de diseño del proyecto (design-taste-frontend, high-end-visual-design,
  emil-design-eng, frontend-design, ui-ux-pro-max, autodrive-design-system) con un flujo
  de trabajo de 5 fases, catálogo de patrones premium y checklist de calidad.
  Úsalo cuando el usuario pida interfaces espectaculares, impactantes, premium, Awwwards,
  landing pages memorables, rediseños visuales, hero cinematográfico, animaciones fluidas,
  UI de nivel agencia, o ejecute /interfaces-espectaculares.
---

# Interfaces Espectaculares

Skill maestro para interfaces que se sienten **diseñadas**, no generadas. Combina dirección
estética audaz, ingeniería de motion, composición espacial y pulido invisible.

## Cuándo invocar

- Landing pages, portfolios, marketing sites, páginas de producto
- Rediseños visuales (preservar marca o overhaul completo)
- Heroes cinematográficos, bento grids, scroll storytelling
- Componentes que deben sentirse premium (cards, nav, CTAs, modales)
- Peticiones en español: "espectacular", "impactante", "premium", "nivel agencia", "wow"

**Fuera de alcance:** dashboards densos, tablas de datos, paneles admin CRUD.
Para eso usar `admin-panel-pro`, `autodrive-admin-panel` o design systems enterprise.

---

## Fase 0: Cargar skills complementarias

Lee y aplica según el contexto. No improvises si ya existe una skill especializada.

| Contexto | Skill a cargar |
|----------|----------------|
| Landing / portfolio / marketing | `design-taste-frontend` + `high-end-visual-design` |
| Pulido de animaciones y micro-interacciones | `emil-design-eng` |
| Dirección estética creativa (greenfield) | `frontend-design` |
| Paletas, tipografías, estilos, UX guidelines | `ui-ux-pro-max` |
| Proyecto AutoDrive / novacar | `autodrive-design-system` (tokens, @ui, i18n) |
| Arquitectura de componentes React | `vercel-composition-patterns` |
| Performance React/Next.js | `vercel-react-best-practices` |
| Auditoría de accesibilidad y UX | `web-design-guidelines` |
| Extraer tokens de un sitio de referencia | `extract-design-system` |

**Regla:** En AutoDrive, `autodrive-design-system` tiene prioridad sobre paletas genéricas.
Las reglas espectaculares se aplican **dentro** de los tokens y componentes `@ui` existentes.

---

## Fase 1: Design Read (obligatorio antes de codear)

Declara en una línea:

> **Leyendo esto como:** \<tipo de página> para \<audiencia>, con lenguaje \<vibe>,
> inclinándose hacia \<familia estética>.

Luego fija tres diales (1-10):

| Dial | Qué controla | Baseline espectacular |
|------|--------------|----------------------|
| `DESIGN_VARIANCE` | Asimetría, ruptura de grid | **8** |
| `MOTION_INTENSITY` | Animación y choreography | **7** |
| `VISUAL_DENSITY` | Aire vs densidad | **4** |

Ajusta según el brief (ver `references/workflow.md`).

Si el brief es ambiguo, pregunta **una sola vez**:
*"¿Prefieres algo más Linear/minimal o más Awwwards/experimental?"*

---

## Fase 2: Dirección estética (Variance Engine)

Elige **1 vibe** + **1 layout** antes de escribir código. Nunca repitas la misma
combinación dos proyectos seguidos.

### Vibes premium

1. **Ethereal Glass** — OLED black, mesh gradients, glass cards, grotesk amplio
2. **Editorial Luxury** — cremas cálidos, serif display masivo, grain sutil
3. **Soft Structuralism** — fondos plateados/blancos, sombras difusas, tipografía bold
4. **Dark Tech** (AutoDrive) — cobalto + cyan neón, glows, profundidad en capas
5. **Kinetic Editorial** — tipografía como protagonista, motion tipográfico

### Layouts premium

1. **Bento Asimétrico** — grid con celdas de tamaños variados (`col-span-8` + `col-span-4`)
2. **Z-Axis Cascade** — cards superpuestas con rotación sutil (`-2deg` / `3deg`)
3. **Editorial Split** — tipografía masiva izquierda, contenido interactivo derecha
4. **Sticky Scroll Stack** — secciones que se apilan al hacer scroll
5. **Horizontal Pan** — scroll vertical → desplazamiento horizontal

Detalle completo en `references/patrones-visuales.md`.

---

## Fase 3: Construcción (arquitectura de componentes)

### Stack por defecto

- **Framework:** Next.js App Router (RSC por defecto)
- **Estilos:** Tailwind v4 + tokens CSS (`:root` en AutoDrive)
- **Motion:** `motion/react` (client islands aislados con `'use client'`)
- **Scroll avanzado:** GSAP + ScrollTrigger (solo en leaf components, con cleanup)
- **Fuentes:** `next/font` — nunca Google Fonts via `<link>`

### Patrones estructurales obligatorios

#### Double-Bezel (Doppelrand)
Nunca pongas cards planas sobre el fondo. Usa envoltura anidada:

```
Outer shell → bg sutil + ring hairline + padding + rounded-[2rem]
Inner core  → bg propio + inset highlight + rounded-[calc(2rem-0.375rem)]
```

#### Button-in-Button
CTAs pill (`rounded-full`). Iconos de flecha en círculo anidado, no sueltos al lado del texto.

#### Floating Island Nav
Navbar como píldora flotante (`mt-6 mx-auto w-max rounded-full`), no barra pegada al top.

#### Macro-whitespace
Secciones con `py-24` mínimo. El espacio negativo es parte del diseño.

### Mobile collapse (no negociable)

Todo layout asimétrico en `md:` colapsa a:
- `grid-cols-1`, `w-full`, `px-4`, `py-8`
- Sin rotaciones ni overlaps negativos bajo `768px`
- `min-h-[100dvh]` — nunca `h-screen`

---

## Fase 4: Motion choreography

Toda animación debe justificarse en una frase: jerarquía, storytelling, feedback o transición.

### Curvas permitidas

```css
/* Entrada suave */
cubic-bezier(0.16, 1, 0.3, 1)

/* Salida con masa */
cubic-bezier(0.32, 0.72, 0, 1)

/* Spring (Motion) */
{ type: "spring", stiffness: 100, damping: 20 }
```

### Prohibido

- `transition: all`
- `ease-in-out` / `linear` en UI principal
- `window.addEventListener('scroll')` en React
- `useState` para posición del mouse o scroll progress
- Animar `top`, `left`, `width`, `height` (solo `transform` + `opacity`)

Recetas con código en `references/recetas-motion.md`.

### Reduced motion

Si `MOTION_INTENSITY > 3`, envolver con `useReducedMotion()` y degradar a estático.

---

## Fase 5: Anti-slop y pre-flight

### Baneados por defecto

| Categoría | Prohibido |
|-----------|-----------|
| Tipografía | Inter, Roboto, Arial como default; Fraunces/Instrument Serif como default |
| Color | Purple gradient slop; beige+brass+espresso en premium consumer |
| Layout | 3 cards iguales; hero centrado con blob gradient; nav de 2 líneas en desktop |
| Contenido | "Elevate", "Seamless", "Next-Gen"; nombres Jane Doe; em-dash (`—`) |
| UI fake | Screenshots hechos con `<div>`; iconos SVG dibujados a mano |
| Motion | Marquee x2 en la misma página; scroll cues ("Scroll to explore") |

### Checklist rápido

Antes de entregar, verifica `references/checklist.md` completo. Mínimo:

- [ ] Design Read declarado + diales explícitos
- [ ] Cero em-dashes en texto visible
- [ ] Hero cabe en viewport (H1 ≤ 2 líneas, CTA visible sin scroll)
- [ ] Un solo accent color en toda la página
- [ ] Imágenes reales (gen-tool, picsum seed, o slots etiquetados)
- [ ] Motion visible si `MOTION_INTENSITY > 4`
- [ ] Mobile collapse explícito por sección
- [ ] WCAG AA en botones y formularios
- [ ] `prefers-reduced-motion` respetado

---

## Protocolo de ejecución (orden estricto)

```
1. [READ]     Design Read + diales
2. [LOAD]     Skills complementarias según tabla Fase 0
3. [ROLL]     Variance Engine: 1 vibe + 1 layout
4. [SCAFFOLD] Fondo, tipografía masiva, macro-whitespace
5. [ARCHITECT] Double-Bezel, Island Nav, Button-in-Button
6. [CHOREOGRAPH] Entradas, hover physics, scroll reveals
7. [POLISH]    Estados loading/empty/error, dark mode, i18n
8. [AUDIT]     Checklist pre-flight → corregir fallos → entregar
```

---

## Referencias

| Archivo | Contenido |
|---------|-----------|
| `references/workflow.md` | Flujo detallado, inferencia de diales, modos greenfield/redesign |
| `references/patrones-visuales.md` | Catálogo de heroes, cards, grids, nav, galerías |
| `references/recetas-motion.md` | Snippets Motion, GSAP, CSS scroll-driven |
| `references/checklist.md` | Pre-flight completo antes de entregar |

---

## Comandos

- **Slash:** `/interfaces-espectaculares`
- **Prompts ejemplo:**
  - "Crea una landing espectacular para [producto]"
  - "Rediseña el hero con motion cinematográfico"
  - "Haz que esta sección se siente premium / nivel agencia"
  - "Aplica el skill de interfaces espectaculares a [página]"