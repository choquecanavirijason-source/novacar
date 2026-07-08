# AutoDrive (novacar) · Instrucciones para Claude

Proyecto Next.js (App Router) de venta de autos y autopartes. Tema **dark premium**
(azul cobalto + cyan neón). Clean Architecture + Feature-Driven + Atomic Design (`@ui`).

## Estructura del repo (monorepo)

```
/frontend   ← toda la app Next.js (correr con: cd frontend && npm run dev, puerto 3001)
/backend    ← API/servicio backend
/docs, /.claude, /.agents   ← documentación y skills (nivel proyecto, en la raíz)
```

**Todas las rutas de código frontend cuelgan de `frontend/`** (ej. `frontend/src/...`).
Los alias (`@ui`, `@core`, `@features`, `@theme`) siguen resolviendo dentro de `frontend/src`.

---

## UI/UX: leer skills ANTES de escribir código visual

Cuando la tarea toque **interfaces, componentes, páginas, layouts, formularios, estilos,
animaciones o UX**, invoca y **lee** el skill maestro y su stack (no improvises diseño):

### 1. Skill maestro (siempre primero)

```
.claude/skills/autodrive-ui/SKILL.md
```

Slash: `/autodrive-ui`

### 2. Stack según la tarea

| Tarea | Skills a leer |
|-------|----------------|
| Cualquier UI en este repo | `autodrive-design-system` |
| Pantalla / componente nuevo | `ui-ux-builder` + `ui-templates` |
| Interfaz super moderna / UI 2026 | `interfaces-modernas` |
| Venta de autos / concesionario / estilo Brator | `venta-autos-brator` |
| Landing / marketing premium | `interfaces-espectaculares` |
| Animaciones / pulido | `emil-design-eng` |
| Anti-slop / landing creativa | `design-taste-frontend` + `high-end-visual-design` |
| Paletas / tipografías | `ui-ux-pro-max` |
| Módulo / feature nuevo | `autodrive-architecture` |
| Panel admin | `autodrive-admin-panel` |
| Revisión UX/a11y | `web-design-guidelines` |
| React performance | `vercel-react-best-practices` |

Rutas: `.claude/skills/<nombre>/SKILL.md`

### 3. Templates de código (usar, no reinventar)

Importar desde `@ui`:

- `HeroSplit`, `Section`, `CatalogLayout`, `CollectionView`, `DetailLayout`
- `CTABand`, `FeatureGrid`, `TileGrid`, `PromoRow`, `TestimonialGrid`
- `EmptyState`, `ErrorState`, `PageShell`, `SectionHeader`

Estilos: `frontend/src/ui/templates/templates.css` (ya global en layout).

### 4. Reglas no negociables (AutoDrive)

1. Tokens `:root` en `frontend/src/theme/globals.css` — cero colores hardcodeados
2. Componentes `@ui` antes de HTML/CSS a mano
3. Textos via `t("key")` — ES + EN en `frontend/src/core/i18n/dictionaries.ts`
4. Estados loading / empty / error en toda vista con datos
5. Mobile-first + accesibilidad (focus, contraste, aria)

---

## Arquitectura y otros skills

- **Arquitectura / features / API:** `autodrive-architecture`
- **Bitácora al terminar tarea significativa:** `autodrive-worklog` → `docs/WORKLOG.md`

---

## Resumen para el usuario

Si piden "interfaz moderna", "super moderno", "UI 2026", "diseño bueno", "UI premium" o "mejorar la pantalla":
→ Leer `autodrive-ui` → `interfaces-modernas` (si pide moderno) → aplicar stack → templates `@ui` → checklist pre-flight.

Si piden "página de venta de autos", "concesionario", "estilo Brator" o referencia Pinterest automotriz:
→ Leer `autodrive-ui` → `venta-autos-brator` → design-system → templates `@ui` → checklist Brator.