---
name: autodrive-design-system
description: Sistema de diseño y guía UI/UX completa de AutoDrive (tema oscuro premium, azul cobalto + cyan neón) con Atomic Design. Úsalo SIEMPRE que crees o estilices CUALQUIER componente, página, sección, card, botón, formulario, tabla, grid o layout — y siempre que necesites decidir "dónde y cómo colocar algo". Define tokens :root, escala de espaciado, sistema de grids y breakpoints, el catálogo de componentes @ui (atoms→molecules→organisms→templates) con cuándo usar cada uno, recetas de layout por tipo de página (hero, grilla de categorías, grilla de productos, sidebar de filtros, fila de KPIs), reglas de responsive, i18n, animación y accesibilidad. Prohíbe colores hardcodeados y textos sin traducir.
---

# Sistema de diseño · UI/UX AutoDrive

Estética: **dark premium, automotriz, tecnológica**. Azul cobalto + cyan neón, superficies
con profundidad, glows sutiles, bordes redondeados generosos, transiciones suaves. Stack:
Next.js (App Router) + CSS con variables `:root` + **Atomic Design** (`src/ui`). Toda la UI
es **bilingüe ES/EN** vía `useTranslation()`.

## Reglas de oro (no negociables)

1. **Cero colores/medidas hardcodeadas.** Todo sale de tokens `:root` (`src/theme/globals.css`).
   Si falta un valor, **añade el token** primero.
2. **Cero texto literal en la UI.** Todo string visible pasa por `t("namespace.key")`
   (`src/core/i18n/dictionaries.ts`, ES + EN). Componer con interpolación `t(k, { n })`.
3. **Compón con `@ui`.** Antes de escribir un `<button>`/`<div className="card">` a mano,
   usa el atom/molécula existente. Si no existe y es reutilizable, créalo en `src/ui`.
4. **Respeta el grid y el espaciado** (abajo). No inventes paddings sueltos; usa la escala.
5. **Mobile-first y responsive** en cada sección (ver breakpoints).

## Tokens clave (`:root`)

```
Marca:    --primary-glow (cobalto)  --accent-neon (cyan)  --primary-soft  --accent-soft
Fondos:   --bg-base  --bg-surface  --bg-elevated  --bg-overlay
Texto:    --text-primary  --text-secondary  --text-muted
Estado:   --success  --warning  --danger
Bordes:   --border  --border-strong
Radios:   --radius-sm(8) --radius-md(12) --radius-lg(20) --radius-pill
Sombra:   --shadow-soft  --glow-primary  --glow-accent
Tiempo:   --transition-smooth(280ms)  --transition-fast(140ms)
Gradiente:--gradient-brand  --gradient-surface
Layout:   --container-max(1180px)
```

## Sistema de layout y espaciado

- **Ancho de página:** envuelve el contenido en `.container` (máx 1180px, centrado,
  padding lateral responsivo). El `<main>` global ya lo aplica en el layout raíz.
- **Escala de espaciado** (usar estos pasos, en px): `4 · 8 · 12 · 14 · 16 · 18 · 20 · 24 ·
  28 · 32 · 40 · 48 · 64 · 80`. Gap entre cards: 14–20. Padding de card: 18–24.
  Padding vertical de sección: 32–80.
- **Grids:** usa `repeat(auto-fill, minmax(MIN, 1fr))` para colecciones responsivas:
  - Productos/autos: `minmax(230–280px, 1fr)`, gap 18–20.
  - Categorías (tiles): `minmax(190px, 1fr)`, gap 14.
  - KPIs: `repeat(4, 1fr)` → colapsa a 2 → 1.
- **Sidebar + contenido** (filtros, admin): `grid-template-columns: SIDEBAR 1fr` con gap 24–28;
  el sidebar es `position: sticky; top: 88px` y colapsa a 1 columna en móvil.
- **Jerarquía vertical de página:** Hero → secciones de contenido → footer. Cada sección
  con su `eyebrow + título + (subtítulo)` mediante `SectionHeader` o `PageShell`.

## Breakpoints (los usados en el código)

| Ancho | Qué cambia |
|-------|-----------|
| ≤ 940px | explorer/marketplace pasan a 1 columna; sidebar deja de ser sticky |
| ≤ 900px | hero pro a 1 columna (visual arriba) |
| ≤ 880px | detalle (2→1 col), why-grid 4→2 |
| ≤ 760px | banners promo 3→1 |
| ≤ 720px | `.container` reduce padding lateral |
| ≤ 560px | navbar compacta |
| ≤ 480px | why-grid →1 col |

Al crear una sección nueva, define su colapso responsivo siguiendo esta tabla.

## Atomic Design — catálogo `@ui`

`atom → molecule → organism → template → page`. Importa desde `@ui` (barrel) o ruta directa.
Un átomo nunca importa una molécula. Los componentes `@ui` son **agnósticos al dominio**
(reciben datos por props).

### Atoms (`@ui/atoms`)
| Componente | Cuándo usarlo |
|------------|----------------|
| `Button` | Toda acción/CTA. Polimórfico: `href` → `<Link>`, si no `<button>`. `variant: primary\|ghost`, `size: sm\|md`, `block`. |
| `Card` | Cualquier superficie elevada/contenedor. `animate` para entrada. |
| `Chip` | Filtro/opción seleccionable (toggle). `active`. |
| `Badge` | Estado/etiqueta corta. `tone: in\|low\|out\|neon`. |
| `Input` | Campo de texto. `pill` para búsquedas. |
| `RatingStars` | Calificación 0–5 con reseñas. |
| `Skeleton` | Placeholder de carga (siempre que haya fetch async). |
| `Logo` | Wordmark AutoDrive (con `suffix` opcional). |
| `Eyebrow` | Etiqueta pequeña cyan sobre un título. |

### Molecules (`@ui/molecules`)
| Componente | Cuándo usarlo |
|------------|----------------|
| `SectionHeader` | Encabezado de sección: eyebrow + título + subtítulo (`align`). |
| `StatCard` | KPI/métrica: label + valor + icono + acento + hint. |
| `SearchInput` | Búsqueda con icono, controlada. |
| `SpecBadge` | Mini-etiqueta de especificación (icono + texto). |
| `LanguageSwitcher` | Conmutador ES/EN (ya vive en el Navbar). |

### Organisms (`@ui/organisms`)
- `Navbar`, `Footer` — globales, montados una vez en el layout raíz. No re-montar.

### Template (`@ui/templates`)
- `PageShell` — estructura de página: header (eyebrow/título/subtítulo) + contenido.
  Úsalo para páginas internas simples. Para landings con muchas secciones, compón
  secciones directamente.

## Recetas de layout (cómo "colocar bien" cada cosa)

**Página de landing / tienda** (orden recomendado):
```
Hero (2 col: texto+CTAs | visual)  →  Categorías populares (tiles)  →
Banners promo (3)  →  Destacados (grid de cards)  →  Beneficios (why-grid)  →  Footer
```

**Hero pro:** grid 2 columnas (`1.05fr 0.95fr`), texto a la izquierda (eyebrow, h1 con
`.text-gradient` en la palabra clave, subtítulo ≤ 520px, 2 botones, fila de stats), visual
a la derecha (tarjeta gradiente con elemento flotante). En ≤900px: 1 columna, visual arriba.

**Grilla de colección** (autos/productos/categorías): `SectionHeader` + grid `auto-fill`.
Card con: media (gradiente + icono), cuerpo (título, specs, precio), footer (precio + CTA).
Entrada en cascada con `animation-delay: ${i * 40–60}ms`.

**Sidebar de filtros + resultados:** grid `SIDEBAR 1fr`. Sidebar sticky con grupos
separados por `1px solid var(--border)`; cada grupo con título en mayúsculas/`--text-muted`.
Toolbar de resultados arriba (búsqueda + conteo + orden). Estados: skeletons → vacío → grid.

**Fila de KPIs (admin):** `repeat(4, 1fr)`, `StatCard` por métrica; el crítico en `danger`.
Debajo, paneles en grid `1.4fr 1fr` (gráfico + acciones).

**Estados obligatorios en toda vista con datos:** loading (Skeleton), vacío (icono + título
+ mensaje + acción sugerida), error (badge `out`). Nunca una colección vacía sin feedback.

## Animación

`fadeInUp` (entrada de cards/secciones, en cascada), `shimmer` (skeletons), `pulse-glow`
(destacar CTA/alerta), `float` (visual del hero/detalle). Hover de tarjeta:
`translateY(-4 a -6px)` + glow, con `--transition-smooth`. Movimiento siempre con propósito.

## Accesibilidad (obligatorio)

- Contraste AA; cuerpo en `--text-primary`.
- `:focus-visible` visible (usar `--glow-accent`).
- `aria-label`/`aria-pressed`/`role` en chips, toggles, switches, listboxes, búsquedas.
- Targets táctiles ≥ 40px. `aria-live="polite"` en zonas de resultados.
- El estado nunca se comunica solo con color: acompañar con texto/badge/icono.

## Anti-patrones

- ❌ `color:#fff` / `padding: 13px` inline → tokens + escala de espaciado.
- ❌ `<button className="btn">` repetido → usa `Button`.
- ❌ Texto literal `"Comprar"` → `t("...")`.
- ❌ Grid de ancho fijo que no colapsa en móvil → `auto-fill` + breakpoint.
- ❌ Glow en todo → pierde el efecto premium (úsalo en foco/hover/marca).
- ❌ Sección sin encabezado (eyebrow/título) → rompe la jerarquía.
- ❌ Paleta clara → la plataforma es dark-only por diseño.

## Checklist al construir UI

- [ ] Envuelto en `.container`; espaciado según la escala
- [ ] Compuesto con atoms/molecules de `@ui` (creé nuevos si faltaban)
- [ ] Todo el texto vía `t()` (ES + EN en el diccionario)
- [ ] Grid responsivo con su breakpoint de colapso
- [ ] Estados loading / vacío / error cubiertos
- [ ] Solo tokens `:root` (sin valores mágicos)
- [ ] Accesibilidad: roles, aria, foco, contraste
- [ ] Registrado el avance con `autodrive-worklog`
