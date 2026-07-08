# Patrones de Layout Modernos

Catálogo de estructuras para páginas y secciones. Elige **1 layout principal** por vista
y varía entre secciones en páginas largas (mínimo 3 familias distintas en 6+ secciones).

---

## 1. Hero Split (Editorial)

**Uso:** Landings, home, páginas de producto.

```
┌─────────────────────────────────────────┐
│  [eyebrow pill]                         │
│  H1 masivo (max 2 líneas)    │  Visual │
│  Subtexto corto              │  real   │
│  [CTA primario] [ghost]      │         │
└─────────────────────────────────────────┘
```

- Texto 50% / visual 50% en desktop
- Mobile: visual arriba, texto abajo
- CTA visible sin scroll en viewport
- AutoDrive: `HeroSplit` + `HeroVisualShell`

---

## 2. Bento Asimétrico

**Uso:** Features, galerías, dashboards ligeros, categorías destacadas.

```css
/* Ejemplo 4 items */
grid-template-columns: repeat(12, 1fr);
/* Item hero: col-span-8 row-span-2 */
/* Items secundarios: col-span-4 */
```

**Reglas:**
- Una celda dominante (más grande)
- Contenido diferente por celda (no repetir mismo card)
- Gap `16–24px`
- Mobile: `grid-cols-1`, resetear todos los `col-span`

---

## 3. Z-Axis Cascade

**Uso:** Portfolios, showcases, secciones de testimonios.

- Cards superpuestas con `translate` y rotación sutil (`-2deg` / `3deg`)
- `z-index` progresivo para profundidad
- Mobile: **sin** rotaciones ni overlaps negativos

---

## 4. Sticky Sidebar + Content

**Uso:** Catálogos, filtros, detalle de producto, docs.

```
┌──────────┬────────────────────────────┐
│ Sidebar  │  Content grid / list       │
│ sticky   │                            │
│ 280px    │                            │
└──────────┴────────────────────────────┘
```

- Sidebar `position: sticky; top: 88px`
- Colapsa a 1 columna ≤ 940px
- AutoDrive: `CatalogLayout`, `DetailLayout`

---

## 5. Horizontal Pan (Scroll-driven)

**Uso:** Galerías de productos, timelines, showcases.

- Scroll vertical → desplazamiento horizontal del track
- Solo en leaf components con cleanup
- Mobile: scroll horizontal nativo o stack vertical
- Preferir CSS `scroll-snap` sobre JS scroll listeners

---

## 6. Full-Bleed Band

**Uso:** CTAs, promos, separadores visuales entre secciones.

- Sección edge-to-edge con fondo contrastante
- Contenido interno en `.container`
- Padding vertical `py-16` a `py-24`
- AutoDrive: `CTABand`, `PromoRow`

---

## 7. KPI Strip

**Uso:** Dashboards ligeros, admin home, métricas.

```
┌────────┬────────┬────────┬────────┐
│ Stat 1 │ Stat 2 │ Stat 3 │ Stat 4 │
└────────┴────────┴────────┴────────┘
```

- `repeat(4, 1fr)` → 2 → 1 en mobile
- Cada stat: número grande + label + delta opcional
- Sin gráficos decorativos sin datos reales

---

## 8. Masonry Light

**Uso:** Galerías de imágenes, blog, catálogo visual.

- CSS `columns` o grid con `grid-row: span N`
- No usar librerías pesadas si < 20 items
- Lazy load imágenes con `loading="lazy"`

---

## Ritmo vertical de página

Orden recomendado para landings/marketing:

```
1. Hero (Split o Full)
2. Social proof / logos (debajo del hero, no dentro)
3. Features (Bento o FeatureGrid)
4. Product showcase (Horizontal Pan o CollectionView)
5. Testimonials (TestimonialGrid)
6. CTA final (CTABand)
7. Footer
```

**Macro-whitespace:** `py-24` mínimo entre secciones marketing.
Secciones funcionales (catálogo): `py-12` a `py-16`.

---

## Responsive collapse universal

| Breakpoint | Acción |
|------------|--------|
| ≤ 940px | Sidebar → stack vertical |
| ≤ 768px | Bento → 1 col, sin rotaciones |
| ≤ 560px | Nav compacta, padding reducido |
| Siempre | `min-h-[100dvh]`, nunca `h-screen` |

---

## Composición con templates @ui (AutoDrive)

| Layout | Template |
|--------|----------|
| Hero Split | `HeroSplit` |
| Catálogo + sidebar | `CatalogLayout` |
| Lista async | `CollectionView` |
| Detalle 2 cols | `DetailLayout` |
| Features grid | `FeatureGrid` |
| Categorías | `TileGrid` |
| CTA band | `CTABand` |
| Página interna | `PageShell` + `Section` |