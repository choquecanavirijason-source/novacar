---
name: ui-ux-builder
description: >
  Skill maestro UI/UX para construir interfaces web excelentes: jerarquía visual, patrones
  de componentes, formularios, estados (loading/empty/error), accesibilidad, responsive y
  feedback al usuario. Orquesta autodrive-design-system, interfaces-espectaculares,
  emil-design-eng, ui-ux-pro-max y web-design-guidelines. Úsalo cuando pidas crear o mejorar
  pantallas, componentes, layouts, formularios, navegación, dashboards ligeros, landings,
  UX flows, o ejecutes /ui-ux-builder. Ideal para que Claude construya UI profesional y usable.
---

# UI/UX Builder

Guía de construcción para interfaces **usables, coherentes y pulidas**. Prioriza claridad,
jerarquía, estados completos y accesibilidad antes que decoración.

## Cuándo invocar

| Tarea | Esta skill |
|-------|------------|
| Crear página, sección o componente nuevo | ✅ |
| Mejorar UX de pantalla existente | ✅ |
| Formularios, filtros, búsqueda, modales | ✅ |
| Estados loading / vacío / error | ✅ |
| Revisar accesibilidad o consistencia | ✅ ( + `web-design-guidelines`) |
| Interfaz super moderna / UI 2026 / sleek | → `interfaces-modernas` |
| Landing espectacular / motion cinematográfico | → `interfaces-espectaculares` |
| Panel admin CRUD denso | → `autodrive-admin-panel` |

---

## Fase 0: Cargar skills según contexto

| Contexto | Skill |
|----------|-------|
| **Siempre en novacar/AutoDrive** | `autodrive-design-system` |
| UI super moderna / cutting-edge | `interfaces-modernas` |
| Marketing / landing premium | `interfaces-espectaculares` |
| Animaciones y micro-interacciones | `emil-design-eng` |
| Paletas, tipografías, estilos | `ui-ux-pro-max` |
| Arquitectura React / features | `autodrive-architecture` |
| Auditoría final de UI | `web-design-guidelines` |
| Registrar avance | `autodrive-worklog` |

**Prioridad en AutoDrive:** tokens `:root` + `@ui` + `t()` > creatividad visual.

---

## Fase 1: UX Read (antes de codear)

Declara en una línea:

> **Construyendo:** \<qué> para \<quién>, objetivo principal \<acción>, densidad \<baja/media/alta>.

Ejemplos:
- *"Construyendo: grilla de autos filtrable para compradores, objetivo explorar y comparar, densidad media."*
- *"Construyendo: formulario de contacto para leads B2C, objetivo enviar consulta, densidad baja."*

Responde mentalmente estas 5 preguntas:

1. **¿Qué hace el usuario aquí?** (1 acción principal)
2. **¿Qué necesita ver primero?** (jerarquía visual)
3. **¿Qué puede salir mal?** (error, vacío, sin conexión)
4. **¿Cómo sabe que funcionó?** (feedback: toast, redirect, badge)
5. **¿Funciona en móvil y con teclado?** (responsive + a11y)

Detalle en `references/heuristica-ux.md`.

---

## Fase 2: Arquitectura de la pantalla

### Jerarquía visual (orden de lectura)

```
1. Contexto     → dónde estoy (nav, breadcrumb, título)
2. Acción       → qué puedo hacer (CTA primario, 1 por vista)
3. Contenido    → datos / cards / formulario
4. Soporte      → filtros, ayuda, secundarios
5. Navegación   → salir, volver, enlaces relacionados
```

### Una acción primaria por vista

- Un solo CTA primario visible sin scroll (en heroes y modales)
- Secundarios en `ghost` o texto link
- No duplicar intención ("Contactar" + "Escríbenos" = mismo intent)

### Densidad visual

| Nivel | Cuándo | Espaciado | Tipografía |
|-------|--------|-----------|------------|
| Baja | Marketing, onboarding, empty states | `py-48`, mucho aire | Display grande |
| Media | Catálogos, listados, perfiles | `py-24`, gaps 16–20 | Body + títulos claros |
| Alta | Admin, tablas, filtros densos | `py-12`, gaps 8–12 | Mono para números |

---

## Fase 3: Construcción con componentes

### Regla de composición

```
1. Buscar en @ui (barrel src/ui/index.ts)
2. Si no existe y es reutilizable → crear en src/ui/ (atom → molecule)
3. Si es específico del feature → en el módulo del feature
4. Nunca duplicar un patrón que ya existe en @ui
```

### Mapa rápido @ui

| Necesidad | Componente |
|-----------|------------|
| CTA / acción | `Button` (primary / ghost, sm / md) |
| Superficie elevada | `Card` |
| Filtro toggle | `Chip` |
| Estado / etiqueta | `Badge` |
| Campo texto | `Input` |
| Búsqueda | `SearchInput` |
| Encabezado sección | `SectionHeader` |
| KPI | `StatCard` |
| Spec técnica | `SpecBadge` |
| Carga | `Skeleton` |
| Página interna | `PageShell` |

Patrones completos en `references/componentes.md`.

### Estados obligatorios (toda vista con datos)

```tsx
if (isLoading) return <SkeletonLayout />;
if (error)     return <ErrorState message={t("...")} onRetry={refetch} />;
if (isEmpty)   return <EmptyState title={t("...")} action={<Button>...</Button>} />;
return <Content />;
```

Nunca mostrar un grid vacío sin explicación. Ver `references/estados-ui.md`.

---

## Fase 4: Formularios y entrada de datos

Reglas no negociables:

- Label **arriba** del input (nunca placeholder como label)
- Error **debajo** del campo afectado (inline, no solo toast)
- Helper text opcional entre label e input
- `gap-2` entre label, input y error
- Focus visible en todos los campos (`:focus-visible`)
- Botón submit deshabilitado solo con razón clara (validando, sin cambios)
- Confirmación tras envío exitoso

Plantillas en `references/formularios.md`.

---

## Fase 5: Pulido y feedback

### Micro-interacciones (emil-design-eng)

| Elemento | Comportamiento |
|----------|----------------|
| Botón | `active:scale-[0.98]`, transición en `transform` no `all` |
| Card hover | `translateY(-4px)` + glow sutil |
| Modal | `scale(0.95)` + `opacity` entrada, `ease-out` |
| Toast | Slide-in desde borde, auto-dismiss 4–6s |
| Skeleton | `shimmer` mientras carga |

### Feedback al usuario

| Acción | Feedback |
|--------|----------|
| Guardar | Toast éxito + estado actualizado en UI |
| Error de red | Mensaje inline + botón reintentar |
| Filtro aplicado | Conteo actualizado + chips activos visibles |
| Búsqueda sin resultados | Empty state con sugerencias |
| Acción destructiva | ConfirmDialog antes de ejecutar |

---

## Fase 6: Accesibilidad y responsive

Checklist mínimo (detalle en `references/accesibilidad.md`):

- [ ] Contraste WCAG AA (4.5:1 texto, 3:1 UI grande)
- [ ] `:focus-visible` en todos los interactivos
- [ ] `aria-label` en iconos sin texto
- [ ] Estado no comunicado solo con color (texto/badge/icono)
- [ ] Targets táctiles ≥ 44×44px
- [ ] `prefers-reduced-motion` respetado
- [ ] `aria-live="polite"` en zonas de resultados dinámicos
- [ ] Orden de tab lógico
- [ ] Imágenes con `alt` descriptivo

### Responsive

- Mobile-first: diseña 320px primero
- Grids: `repeat(auto-fill, minmax(Xpx, 1fr))` no anchos fijos
- Sidebars: colapsan a 1 columna ≤ 940px en AutoDrive
- Nav: una línea en desktop, hamburger en móvil
- Tablas: scroll horizontal o cards en móvil

---

## Fase 7: Pre-flight antes de entregar

```
□ UX Read declarado
□ Una acción primaria clara
□ Estados loading / empty / error implementados
□ Textos via t() (ES + EN) en AutoDrive
□ Tokens :root, sin colores hardcodeados
□ Componentes @ui reutilizados
□ Formularios con label arriba, error abajo
□ Focus visible y contraste AA
□ Responsive con breakpoint de colapso definido
□ Sin texto literal ni valores mágicos sueltos
□ autodrive-worklog actualizado (tareas significativas)
```

Para landings premium, añadir checklist de `interfaces-espectaculares`.

---

## Protocolo de ejecución

```
1. [UX READ]    Objetivo, usuario, densidad
2. [LOAD]       Skills complementarias
3. [STRUCTURE]  Jerarquía + acción primaria + layout
4. [COMPOSE]    @ui atoms → molecules → sección
5. [STATES]     Loading, empty, error, success feedback
6. [POLISH]     Hover, focus, motion proporcional
7. [A11Y]       Contraste, aria, keyboard, reduced-motion
8. [AUDIT]      Pre-flight → corregir → entregar
```

---

## Referencias

| Archivo | Contenido |
|---------|-----------|
| `references/heuristica-ux.md` | Heurísticas Nielsen, decisiones UX, IA |
| `references/componentes.md` | Patrones por tipo de UI (cards, nav, modales…) |
| `references/formularios.md` | Validación, layout, errores, accesibilidad |
| `references/estados-ui.md` | Loading, empty, error, success patterns |
| `references/accesibilidad.md` | WCAG, ARIA, keyboard, motion |

---

## Comandos

- **Slash:** `/ui-ux-builder`
- **Prompts ejemplo:**
  - "Construye la pantalla de explorar autos con filtros"
  - "Mejora el UX del formulario de contacto"
  - "Añade estados loading y empty a esta grilla"
  - "Haz esta interfaz más usable y profesional"