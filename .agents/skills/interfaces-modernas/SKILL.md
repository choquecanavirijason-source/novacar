---
name: interfaces-modernas
description: >
  Skill maestro para crear interfaces web super modernas (2026): SaaS, e-commerce, landings,
  dashboards ligeros y componentes premium. Orquesta design-taste-frontend, high-end-visual-design,
  emil-design-eng, frontend-design, ui-ux-pro-max y autodrive-design-system con un flujo de
  6 fases, tendencias actuales, recetas de componentes y checklist anti-slop. Úsalo cuando el
  usuario pida interfaz moderna, UI 2026, diseño actualizado, super moderno, ultra moderno,
  sleek, cutting-edge, futurista, glassmorphism evolucionado, bento grid, dark premium, o
  ejecute /interfaces-modernas.
---

# Interfaces Modernas · Skill Maestro

Skill para interfaces que se sienten **de 2026**, no de 2020. Combina tendencias actuales,
composición espacial, motion con propósito y pulido invisible. Funciona en landings, apps,
catálogos, dashboards ligeros y componentes sueltos.

**Directive:** No escribas UI hasta completar Fases 0–2. No uses estética genérica de LLM.

---

## Cuándo invocar

| Petición del usuario | Esta skill |
|---------------------|------------|
| "interfaz moderna", "UI 2026", "super moderno", "sleek", "cutting-edge" | ✅ |
| Landing / marketing premium / wow factor | ✅ (+ `interfaces-espectaculares` si pide nivel agencia) |
| Componente, card, nav, hero, formulario moderno | ✅ |
| Rediseño visual de pantalla existente | ✅ (modo audit-first) |
| Panel admin CRUD denso / tablas enterprise | → `autodrive-admin-panel` |
| Solo lógica / API / arquitectura | → `autodrive-architecture` |

---

## Fase 0: Cargar skills complementarias

Lee `SKILL.md` de cada una con la herramienta Read **antes de codear**:

| Contexto | Skill |
|----------|-------|
| **Siempre en novacar/AutoDrive** | `autodrive-design-system` |
| UX, formularios, estados, a11y | `ui-ux-builder` |
| Templates de página listos | `ui-templates` |
| Anti-slop / inferencia de brief | `design-taste-frontend` |
| Estética premium / agency-tier | `high-end-visual-design` |
| Animaciones y micro-interacciones | `emil-design-eng` |
| Dirección creativa greenfield | `frontend-design` |
| Paletas, tipografías, estilos | `ui-ux-pro-max` |
| Landing cinematográfica / Awwwards | `interfaces-espectaculares` |
| Performance React/Next.js | `vercel-react-best-practices` |
| Auditoría accesibilidad | `web-design-guidelines` |

**Regla AutoDrive:** tokens `:root` + `@ui` + `t()` tienen prioridad sobre paletas genéricas.
Las reglas modernas se aplican **dentro** del design system existente.

**Referencias de esta skill** (léelas según la tarea):

| Archivo | Cuándo leerlo |
|---------|---------------|
| `references/tendencias-2026.md` | Siempre — define el vocabulario visual moderno |
| `references/patrones-layout.md` | Al elegir estructura de página o sección |
| `references/recetas-componentes.md` | Al construir hero, nav, cards, CTAs, forms |
| `references/anti-slop.md` | Antes del pre-flight |
| `references/checklist-moderna.md` | Obligatorio antes de entregar |

---

## Fase 1: Modern Read (obligatorio)

Declara en una línea:

> **Modern Read:** \<tipo de UI> para \<audiencia>, vibe \<estética 2026>,
> densidad \<baja|media|alta>, motion \<sutil|moderado|expresivo>.

Ejemplos:
- *Modern Read: catálogo de autos para compradores, vibe dark tech premium, densidad media, motion moderado.*
- *Modern Read: landing SaaS para founders, vibe ethereal glass, densidad baja, motion expresivo.*
- *Modern Read: card de producto para e-commerce, vibe soft structuralism, densidad media, motion sutil.*

Si el brief es ambiguo, pregunta **una sola vez**:
*"¿Prefieres algo más Linear/minimal o más experimental con motion?"*

---

## Fase 2: Tres diales + tendencia 2026

Fija tres diales (1–10) y **1 tendencia principal** de `references/tendencias-2026.md`:

| Dial | Controla | Baseline moderno |
|------|----------|------------------|
| `DESIGN_VARIANCE` | Asimetría, ruptura de grid | **7** |
| `MOTION_INTENSITY` | Animación y choreography | **5** |
| `VISUAL_DENSITY` | Aire vs información | **4** |

### Presets por tipo de UI

| Tipo | VARIANCE | MOTION | DENSITY |
|------|----------|--------|---------|
| SaaS / app funcional | 5–6 | 3–4 | 5–6 |
| E-commerce / catálogo | 6–7 | 4–5 | 5 |
| Landing marketing | 7–8 | 6–7 | 3–4 |
| Portfolio / creativo | 8–9 | 7–8 | 3 |
| AutoDrive (dark premium) | 7 | 5–6 | 4 |

### Elegir 1 tendencia 2026 (no mezclar más de 2)

1. **Spatial Depth** — capas, glows sutiles, profundidad Z
2. **Glass Evolved** — blur selectivo, hairlines, no glass en todo
3. **Bento Intelligence** — grids asimétricos con jerarquía clara
4. **Typography-Led** — tipografía como protagonista visual
5. **Kinetic Micro** — motion en hover/focus, no en todo
6. **Dark Premium** (AutoDrive) — cobalto + cyan, superficies elevadas

Detalle en `references/tendencias-2026.md`.

---

## Fase 3: Arquitectura visual

### Patrones estructurales modernos (elige según contexto)

| Patrón | Cuándo | Referencia |
|--------|--------|------------|
| **Double-Bezel** | Cards, imágenes, contenedores premium | `recetas-componentes.md` |
| **Floating Island Nav** | Marketing, landings | `recetas-componentes.md` |
| **Button-in-Button** | CTAs primarios con icono | `recetas-componentes.md` |
| **Macro-whitespace** | Secciones marketing (`py-24`+) | `patrones-layout.md` |
| **Sticky Sidebar** | Catálogos, filtros, detalle | `ui-templates` → `CatalogLayout` |
| **Bento Asimétrico** | Features, galerías, dashboards ligeros | `patrones-layout.md` |

### Mobile collapse (no negociable)

Todo layout asimétrico en `md:` colapsa a:
- `grid-cols-1`, `w-full`, padding lateral consistente
- Sin rotaciones ni overlaps negativos bajo `768px`
- `min-h-[100dvh]` — nunca `h-screen`
- Touch targets ≥ 44px

### AutoDrive: templates @ui primero

```tsx
import { HeroSplit, Section, CollectionView, CatalogLayout, Button } from "@ui";
```

| Necesidad | Template |
|-----------|----------|
| Hero | `HeroSplit` |
| Lista async | `CollectionView` |
| Catálogo + filtros | `CatalogLayout` |
| Detalle 2 cols | `DetailLayout` |
| CTA band | `CTABand` |

---

## Fase 4: Motion con propósito

Antes de cada animación, justifica en una frase (jerarquía, feedback, transición o storytelling).

### Reglas

- Entrada UI → `ease-out` / `cubic-bezier(0.16, 1, 0.3, 1)`
- Salida → `cubic-bezier(0.32, 0.72, 0, 1)`
- Solo `transform` + `opacity` — nunca `top/left/width/height`
- Sin `transition: all`
- Acciones repetidas (100+/día) → **sin animación** (ver `emil-design-eng`)
- `prefers-reduced-motion` → degradar a estático

Snippets en `references/recetas-componentes.md` y `interfaces-espectaculares/references/recetas-motion.md`.

---

## Fase 5: Construcción

### Orden de implementación

```
1. Tokens / variables (AutoDrive: :root existente)
2. Layout shell (grid, container, secciones)
3. Tipografía y jerarquía (H1 → body → meta)
4. Componentes @ui o recetas de referencia
5. Estados: loading (Skeleton), empty (EmptyState), error (ErrorState)
6. Motion (entradas, hover, focus)
7. i18n: t("key") + diccionario ES/EN
8. Responsive collapse por breakpoint
```

### Reglas de oro

1. **Un CTA primario** por vista — secundarios en `ghost`
2. **Un accent color** dominante por página
3. **Focus visible** en todo interactivo
4. **Contraste WCAG AA** en texto y botones
5. **Imágenes reales** — no divs que simulan screenshots
6. **Cero texto literal** en UI (AutoDrive)

---

## Fase 6: Pre-flight

Ejecuta `references/checklist-moderna.md` completo. Mínimo rápido:

```
□ Modern Read declarado + diales + tendencia 2026
□ Skills complementarias leídas
□ Cero patrones de anti-slop (ver references/anti-slop.md)
□ Hero cabe en viewport (H1 ≤ 2 líneas, CTA visible)
□ Mobile collapse definido por sección
□ Estados loading / empty / error
□ Motion justificado; reduced-motion respetado
□ AutoDrive: tokens + @ui + i18n verificados
```

Si falla algún ítem → corregir antes de responder.

---

## Protocolo de ejecución (orden estricto)

```
1. [READ]    Modern Read + diales + tendencia 2026
2. [LOAD]    Skills complementarias (tabla Fase 0)
3. [SCAN]    tendencias-2026.md + patrones-layout.md
4. [ARCHITECT] Layout + patrones estructurales
5. [BUILD]   Componentes con recetas-componentes.md
6. [MOTION]  Animaciones con propósito
7. [POLISH]  Estados, i18n, responsive, a11y
8. [AUDIT]   checklist-moderna.md → entregar
```

---

## Mapa de skills del ecosistema

```
interfaces-modernas .......... ESTE (orquestador moderno)
interfaces-espectaculares .... landings nivel agencia / Awwwards
autodrive-ui ................. orquestador AutoDrive
autodrive-design-system ...... tokens + @ui + i18n
ui-ux-builder ................ UX + formularios + estados
ui-templates ................. layouts premium listos
design-taste-frontend ........ anti-slop + inferencia
high-end-visual-design ....... estética agency-tier
emil-design-eng .............. motion philosophy
frontend-design .............. dirección creativa
ui-ux-pro-max ................ paletas y estilos
```

---

## Comandos

- **Slash:** `/interfaces-modernas`
- **Prompts ejemplo:**
  - "Crea una interfaz super moderna para [pantalla]"
  - "Moderniza el diseño de [componente] con estilo 2026"
  - "Haz que esta UI se vea cutting-edge / sleek / premium"
  - "Aplica interfaces modernas al catálogo / hero / dashboard"

---

## Al terminar tarea significativa (AutoDrive)

Registrar en `docs/WORKLOG.md` vía skill `autodrive-worklog`.