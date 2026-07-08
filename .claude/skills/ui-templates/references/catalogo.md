# Catálogo de Templates · API

## HeroSplit

**Props:** `eyebrow?`, `title`, `subtitle?`, `actions?`, `stats?`, `visual?`, `visualFirstOnMobile?`

- Título con `text-gradient` en palabra clave
- Stats: array `{ value, label }`
- `HeroVisualShell` para el panel glass del visual

**Mobile:** visual arriba si `visualFirstOnMobile` (default true).

---

## Section

**Props:** `size?: "sm" | "md" | "lg"`, `id?`, `className?`

Padding vertical: sm=32px, md=48px, lg=64px.

---

## PageShell

**Props:** `eyebrow?`, `title?`, `subtitle?`, `children`, `padded?`

Para páginas internas. Usa `SectionHeader` internamente.

---

## CatalogLayout

**Props:** `sidebar`, `toolbar?`, `children`

- Sidebar sticky hasta 940px
- Toolbar: búsqueda + meta a la derecha

---

## CollectionView\<T\>

**Props:** `items`, `loading`, `error?`, `onRetry?`, `renderItem`, `getKey`, `emptyTitle`, `emptyMessage?`, `emptyIcon?`, `emptyAction?`, `skeletonCount?`, `variant?: "cards" | "tiles"`

Maneja automáticamente:
1. Error → `ErrorState` + retry
2. Loading → skeletons en grid
3. Empty → `EmptyState`
4. Data → grid con `renderItem`

---

## DetailLayout

**Props:** `media`, `info`

Grid 1.1fr + 1fr → 1 col en ≤880px.

---

## CTABand

**Props:** `title`, `subtitle?`, `actions`

Centrado con glow radial. Ideal al final de landing.

---

## FeatureGrid

**Props:** `items: { icon, title, description }[]`

4 → 2 → 1 columnas. Hover lift -4px.

---

## TileGrid

**Props:** `items: { id, icon, name, meta?, href?, onClick? }[]`

Tiles clickeables (Link o button). Animación cascada.

---

## PromoRow

**Props:** `items: { id, icon, title, description, cta?, href?, gradient? }[]`

3 columnas → 1 en móvil. Gradiente por item o brand default.

---

## TestimonialGrid

**Props:** `items: { id, quote, author, role?, avatar? }[]`

Quotes max 3 líneas recomendado. Avatar auto si no se pasa.

---

## EmptyState / ErrorState

**EmptyState:** `icon?`, `title`, `message?`, `action?`
**ErrorState:** `title?`, `message`, `action?` (pasar Button retry)

---

## Anti-patrones

| Mal | Bien |
|-----|------|
| Copiar CSS de hero en cada feature | `HeroSplit` + `HeroVisualShell` |
| if/loading/empty manual en cada página | `CollectionView` |
| padding suelto `padding: 37px` | `Section` con size |
| div vacío como hero visual | `HeroVisualShell` con contenido |
| 3 secciones iguales image+text | Variar: TileGrid, FeatureGrid, CTABand |