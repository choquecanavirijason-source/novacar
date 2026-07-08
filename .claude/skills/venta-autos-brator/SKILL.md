---
name: venta-autos-brator
description: >
  Skill maestro para crear páginas de venta de automóviles estilo Brator (referencia Pinterest
  / ThemeForest): dark premium, hero cinematográfico con vehículo, barra de confianza, buscador
  por marca/modelo/año, grid de productos con tabs, categorías, marcas destacadas, promos y
  countdown. Adapta el look Brator al design system AutoDrive (tokens :root, @ui, i18n).
  Úsalo cuando pidan página de venta de autos, concesionario, catálogo automotriz, tienda de
  autos, estilo Brator, referencia Pinterest automotriz, o ejecute /venta-autos-brator.
---

# Venta de Autos · Estilo Brator

Skill para replicar la **experiencia visual y estructural** del tema Brator (auto parts /
automotive e-commerce) adaptada a **venta de automóviles** en AutoDrive.

**Referencia visual:** [Pinterest pin](https://www.pinterest.com/pin/921760248718718563/) ·
[Demo Brator](https://brator-main.smartdemowp.com/)

**Ruta Claude:** `.claude/skills/venta-autos-brator/SKILL.md`

---

## Cuándo invocar

| Petición | Esta skill |
|----------|------------|
| Página de venta de autos / concesionario | ✅ |
| Home estilo Brator / automotive e-commerce | ✅ |
| Catálogo con buscador por vehículo (año/marca/modelo) | ✅ |
| Grid de autos con ratings, precio, badges de descuento | ✅ |
| Referencia Pinterest automotriz | ✅ |
| Solo panel admin CRUD | → `autodrive-admin-panel` |
| Landing abstracta sin e-commerce | → `interfaces-espectaculares` |

---

## Fase 0: Cargar skills complementarias

Lee antes de codear:

| Orden | Skill | Por qué |
|-------|-------|---------|
| 1 | `autodrive-design-system` | Tokens, @ui, i18n (SIEMPRE) |
| 2 | `ui-ux-builder` | UX, estados, formularios |
| 3 | `ui-templates` | HeroSplit, CatalogLayout, CollectionView |
| 4 | `interfaces-modernas` | Patrones 2026, anti-slop |
| 5 | `emil-design-eng` | Micro-interacciones en cards y CTAs |

**Referencias de esta skill:**

| Archivo | Contenido |
|---------|-----------|
| `references/referencia-visual.md` | Auditoría del pin Brator (colores, tipografía, secciones) |
| `references/estructura-home.md` | Orden de secciones de la home completa |
| `references/componentes-venta.md` | Recetas: promo bar, vehicle finder, product card, trust bar… |
| `references/adaptacion-tokens.md` | Mapeo Brator → tokens AutoDrive |
| `references/checklist-venta-autos.md` | Pre-flight antes de entregar |

---

## Fase 1: Brator Read (obligatorio)

Declara en una línea:

> **Brator Read:** \<tipo de página> para \<audiencia>, enfoque \<venta autos|autopartes|mixto>,
> acento \<palabra clave del hero>, densidad \<media|alta>.

Ejemplo venta de autos:
> *Brator Read: home de concesionario para compradores B2C, enfoque venta autos,
> acento "Tu Próximo Auto" en cyan neón, densidad media.*

---

## Fase 2: ADN visual Brator (adaptado a AutoDrive)

### Lo que copiamos de Brator

| Elemento Brator | Adaptación AutoDrive |
|-----------------|---------------------|
| Fondo negro puro | `--bg-base` + mesh gradient cobalto/cyan |
| Acento naranja/rojo en headlines | `--accent-neon` (cyan) o `--danger` para urgencia/promo |
| Hero con foto de vehículo full-bleed | `HeroSplit` + imagen real del auto |
| Headline 3 líneas con palabra en color | H1 con `<span className="text-gradient">` |
| Top promo strip (BLACK FRIDAY) | `PromoRow` o banner fino con `Badge tone="neon"` |
| Barra de confianza 4 columnas | `FeatureGrid` con iconos |
| Buscador por vehículo (año/marca/modelo) | Formulario con `Select` + `Button` |
| Grid 4–5 columnas de productos | `CollectionView` + cards de vehículo |
| Tabs de categoría (All, Body Parts…) | `Chip` group para filtros rápidos |
| Shop by Categories (tiles con icono) | `TileGrid` |
| Featured Makes (logos de marcas) | Carrusel horizontal de marcas |
| Promo banners (What's Hot) | `PromoRow` bento asimétrico |
| Countdown Best Seller | Timer + grid de destacados |
| Header: search + teléfono + wishlist + cart | Extender `Navbar` con acciones |

### Lo que NO copiamos

- Naranja `#FF3D00` hardcodeado → usar tokens
- Texto literal en inglés → `t("key")` ES/EN
- 5 columnas en mobile → colapsar a 1–2
- WooCommerce markup → componentes React `@ui`

Detalle completo en `references/referencia-visual.md` y `references/adaptacion-tokens.md`.

---

## Fase 3: Estructura de la home (orden estricto)

Construye las secciones en este orden (ver `references/estructura-home.md`):

```
1. PromoBanner          — strip fino superior (oferta/código)
2. Navbar               — logo + nav + búsqueda + teléfono + acciones
3. HeroVehicle          — foto auto + headline 3 líneas + CTA
4. TrustBar             — 4 beneficios (envío, calidad, soporte, devolución)
5. VehicleFinder        — buscar por año / marca / modelo / combustible
6. CategoryTiles        — grid de categorías (SUV, Sedán, Pickup…)
7. FeaturedVehicles     — tabs + grid de autos destacados
8. PromoBento           — 2–4 banners promocionales asimétricos
9. BrandCarousel        — logos marcas (Toyota, Ford, BMW…)
10. BestSellers         — countdown + grid con badge descuento
11. NewArrivals         — grid de recién llegados
12. CTABand             — cierre con CTA principal
13. Footer              — ya global en layout
```

Cada sección con `Section` + `SectionHeader` donde aplique.

---

## Fase 4: Componentes clave

### Vehicle Card (estilo Brator)

```
┌─────────────────────┐
│  [foto auto]        │
│  [badge -10%]       │
├─────────────────────┤
│  Categoría · Marca  │
│  Nombre del modelo  │
│  ★★★★☆ (24)        │
│  $32,000 – $45,000  │
│  [Ver detalle]      │
└─────────────────────┘
```

- Imagen `aspect-[4/3]`, hover `scale-105`
- `Badge` para descuento (`tone="danger"` o `tone="neon"`)
- `RatingStars` + contador de reseñas
- Precio con rango si aplica
- CTA `Button variant="ghost" size="sm"`

Recetas completas en `references/componentes-venta.md`.

### Vehicle Finder

```
┌──────────────────────────────────────────────────────────┐
│  Buscar por vehículo                                     │
│  Filtra por año, marca y modelo para encontrar tu auto.  │
│  [Año ▼] [Marca ▼] [Modelo ▼] [Combustible ▼] [Buscar]  │
└──────────────────────────────────────────────────────────┘
```

- Fondo `--bg-elevated`, borde `--border`
- Selects en fila desktop, stack mobile
- Botón primario `Buscar` → navega a `/catalogo?year=&brand=&model=`

---

## Fase 5: Motion y pulido

| Elemento | Motion |
|----------|--------|
| Hero imagen | Fade-in suave al cargar |
| Product cards | Hover scale 1.02 + imagen scale 1.05 |
| Category tiles | Hover border glow `--glow-accent` |
| Countdown | Sin animación excesiva; solo tick de números |
| Tabs categoría | Transición de underline/glow en activo |
| Vehicle finder | Sin animación (formulario funcional) |

Reglas de `emil-design-eng`: acciones repetidas sin animación.

---

## Fase 6: Pre-flight

Ejecuta `references/checklist-venta-autos.md`. Mínimo:

```
□ Brator Read declarado
□ Estructura home en orden correcto (13 secciones)
□ Hero con vehículo real + headline 3 líneas + CTA visible
□ Trust bar con 4 items
□ Vehicle finder funcional
□ Grid de vehículos con rating, precio, badge descuento
□ Tokens :root — cero hex sueltos
□ i18n ES/EN completo
□ Mobile: grid 1–2 cols, finder en stack
□ Estados loading/empty/error en grids async
```

---

## Protocolo de ejecución

```
1. [READ]    Brator Read + referencia-visual.md
2. [LOAD]    design-system + ui-templates + interfaces-modernas
3. [MAP]     adaptacion-tokens.md (Brator → AutoDrive)
4. [SCAFFOLD] estructura-home.md sección por sección
5. [BUILD]   componentes-venta.md (cards, finder, trust bar…)
6. [POLISH]  motion, i18n, responsive
7. [AUDIT]   checklist-venta-autos.md → entregar
```

---

## Comandos

- **Slash:** `/venta-autos-brator`
- **Prompts ejemplo:**
  - "Crea la home de venta de autos como el pin de Pinterest Brator"
  - "Página de concesionario estilo Brator con buscador por vehículo"
  - "Grid de autos destacados como Brator con tabs y countdown"
  - "Adapta el catálogo al estilo automotive e-commerce Brator"

---

## Al terminar tarea significativa

Registrar en `docs/WORKLOG.md` vía `autodrive-worklog`.