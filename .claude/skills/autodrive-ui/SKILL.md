---
name: autodrive-ui
description: >
  Skill maestro UI de AutoDrive. OBLIGATORIO leerlo e invocar el stack de skills antes de
  crear o modificar cualquier interfaz, componente, página, layout, formulario, estilo o animación.
  Garantiza interfaces modernas, precisas y coherentes con el design system. Triggers: interfaz,
  UI, UX, diseño, pantalla, componente, landing, hero, formulario, layout, moderno, premium,
  mejorar diseño, estilizar, CSS, responsive, accesibilidad. Slash: /autodrive-ui.
---

# AutoDrive UI · Skill Maestro

**Directive:** Antes de escribir una sola línea de UI, ejecuta este protocolo completo.
No saltes pasos. No uses estética genérica de LLM.

---

## Paso 0: Confirmar alcance

¿La tarea cambia cómo algo **se ve, se siente, se mueve o se interactúa**?
- **Sí** → continúa con Pasos 1–5
- **No** (solo backend/lógica) → usa `autodrive-architecture` y sal

---

## Paso 1: Leer skills obligatorias (en orden)

Lee el archivo `SKILL.md` de cada una con la herramienta Read:

```
1. autodrive-design-system     ← tokens, @ui, i18n, layout (SIEMPRE)
2. ui-ux-builder               ← UX, estados, formularios, a11y
3. ui-templates                ← qué template usar (HeroSplit, CollectionView…)
```

### Skills adicionales según contexto

| Si el brief incluye… | Lee también |
|---------------------|-------------|
| "moderna", "2026", "super moderno", "sleek", "cutting-edge" | `interfaces-modernas` |
| venta de autos, concesionario, Brator, Pinterest automotriz | `venta-autos-brator` |
| "espectacular", "premium", "Awwwards", landing marketing | `interfaces-espectaculares` |
| "animación", "motion", "micro-interacción", pulido | `emil-design-eng` |
| landing/portfolio anti-template | `design-taste-frontend` + `high-end-visual-design` |
| paleta, tipografía, estilo nuevo | `ui-ux-pro-max` |
| panel admin, dashboard, CRUD | `autodrive-admin-panel` |
| revisar / auditar UI existente | `web-design-guidelines` |
| nuevo módulo o feature | `autodrive-architecture` |
| componentes React complejos | `vercel-composition-patterns` |

**Ruta:** `.claude/skills/<nombre>/SKILL.md`

---

## Paso 2: Declarar UI Read (una línea, obligatorio)

Antes de codear, escribe:

> **UI Read:** \<tipo de pantalla> para \<usuario>, objetivo \<acción principal>,
> enfoque \<templates + vibe>, densidad \<baja|media|alta>.

Ejemplo:
> *UI Read: catálogo filtrable para compradores, objetivo comparar vehículos,
> enfoque CatalogLayout + CollectionView, densidad media.*

---

## Paso 3: Elegir templates (@ui)

| Necesidad | Template |
|-----------|----------|
| Hero landing | `HeroSplit` + `HeroVisualShell` |
| Sección con título | `Section` + `SectionHeader` |
| Lista con datos async | `CollectionView` (loading/empty/error) |
| Catálogo con filtros | `CatalogLayout` |
| Detalle 2 columnas | `DetailLayout` |
| CTA final | `CTABand` |
| Beneficios | `FeatureGrid` |
| Categorías | `TileGrid` |
| Promos | `PromoRow` |
| Testimonios | `TestimonialGrid` |
| Página interna | `PageShell` |

```tsx
import { HeroSplit, Section, CollectionView, Button } from "@ui";
```

---

## Paso 4: Construir con reglas de oro

1. **Tokens** — solo `var(--*)` de `:root`, nunca hex sueltos
2. **@ui** — `Button`, `Card`, `Input`, `Badge`… antes de reinventar
3. **i18n** — `t("namespace.key")` + entrada en diccionario ES/EN
4. **Estados** — loading (Skeleton), empty (EmptyState), error (ErrorState)
5. **Un CTA primario** por vista — secundarios en `ghost`
6. **Responsive** — mobile-first, breakpoints del design system
7. **A11y** — focus visible, contraste AA, aria donde aplique

### Para venta de autos estilo Brator (venta-autos-brator)

- Brator Read + estructura home de 13 secciones
- Hero con vehículo, trust bar, vehicle finder, grid con tabs
- Checklist: `venta-autos-brator/references/checklist-venta-autos.md`

### Para interfaces super modernas (interfaces-modernas)

- Modern Read + diales + tendencia 2026
- Patrones: Double-Bezel, Floating Island Nav, Bento Intelligence
- Checklist pre-flight de `interfaces-modernas/references/checklist-moderna.md`

### Para landings premium (interfaces-espectaculares)

- Design Read + diales (VARIANCE 8, MOTION 7, DENSITY 4)
- Double-Bezel en cards, macro-whitespace, motion con propósito
- Checklist pre-flight de `interfaces-espectaculares/references/checklist.md`

---

## Paso 5: Pre-flight antes de entregar

```
□ UI Read declarado
□ Skills relevantes leídas (mínimo: design-system + ui-ux-builder + ui-templates)
□ Templates @ui usados donde aplicaba
□ Cero texto literal en UI
□ Cero colores hardcodeados
□ Estados loading / empty / error
□ Mobile collapse definido
□ Contraste y focus verificados
```

Si falla algún ítem → corregir antes de responder al usuario.

---

## Mapa rápido de skills del proyecto

```
autodrive-ui .................. ESTE (orquestador)
venta-autos-brator .......... venta autos estilo Brator/Pinterest
interfaces-modernas ......... UI super moderna 2026
autodrive-design-system ....... tokens + @ui + i18n
ui-ux-builder ............... UX + formularios + a11y
ui-templates ................ layouts premium listos
interfaces-espectaculares ..... landings nivel agencia
emil-design-eng ............... animaciones y pulido
design-taste-frontend ......... anti-slop marketing
high-end-visual-design ........ estética premium
ui-ux-pro-max ................. paletas y estilos
web-design-guidelines ......... auditoría
autodrive-architecture ........ capas y features
autodrive-admin-panel ......... backoffice
```

---

## Al terminar tarea significativa

Registrar en `docs/WORKLOG.md` vía skill `autodrive-worklog`.