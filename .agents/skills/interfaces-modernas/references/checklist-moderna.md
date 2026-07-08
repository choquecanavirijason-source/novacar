# Pre-Flight Checklist · Interfaces Modernas

Ejecutar **antes de entregar**. Si un ítem falla, corregir antes de responder.

---

## Dirección y contexto

- [ ] Modern Read declarado en una línea
- [ ] Diales (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`) explícitos
- [ ] Tendencia 2026 elegida (de `tendencias-2026.md`)
- [ ] Skills complementarias cargadas según contexto
- [ ] Modo detectado: greenfield / redesign-preserve / redesign-overhaul

---

## Anti-slop

- [ ] Revisado `anti-slop.md` — cero violaciones
- [ ] Cero em-dashes en texto visible
- [ ] Sin Inter/Roboto/Arial como font display
- [ ] Sin purple-gradient-slop
- [ ] Sin 3 cards idénticas en fila
- [ ] Sin div-based fake screenshots
- [ ] Copy específico del dominio (no "Elevate your experience")

---

## Hero y above-the-fold

- [ ] CTA visible sin scroll en viewport inicial
- [ ] H1 máximo 2 líneas en desktop
- [ ] Subtexto máximo 20 palabras
- [ ] Visual real (imagen, video, componente) — no solo gradient blob
- [ ] Logo wall / social proof **debajo** del hero, no dentro

---

## Layout y composición

- [ ] Layout elegido de `patrones-layout.md`
- [ ] Mínimo 3 familias de layout distintas (en páginas 6+ secciones)
- [ ] Mobile collapse explícito por sección
- [ ] `min-h-[100dvh]` — nunca `h-screen`
- [ ] Macro-whitespace en secciones marketing (`py-24`+)
- [ ] Nav en una línea desktop (marketing)

---

## Componentes

- [ ] Cards premium usan Double-Bezel donde aplica
- [ ] CTA primario con Button-in-Button si lleva icono
- [ ] Un solo CTA primario por vista
- [ ] Eyebrow pills con moderación (max 1 cada 3 secciones)
- [ ] Recetas de `recetas-componentes.md` adaptadas correctamente

---

## Color, tipo y forma

- [ ] Un solo accent color dominante
- [ ] Tokens `:root` (AutoDrive) — cero hex sueltos
- [ ] Máximo 2 familias tipográficas
- [ ] Radios consistentes (`--radius-*`)
- [ ] Bordes hairline, no grises duros

---

## Motion

- [ ] Cada animación justificada (jerarquía, feedback, transición)
- [ ] Sin `transition: all`
- [ ] Solo `transform` + `opacity`
- [ ] Acciones frecuentes sin animación
- [ ] `prefers-reduced-motion` implementado si `MOTION_INTENSITY > 3`
- [ ] Máximo 1 marquee por página

---

## Estados y datos

- [ ] Loading: Skeleton o spinner coherente
- [ ] Empty: EmptyState con CTA de recuperación
- [ ] Error: ErrorState con retry
- [ ] Datos reales o mocks del dominio (no Lorem)

---

## AutoDrive específico

- [ ] Componentes `@ui` usados donde existían equivalentes
- [ ] Todo texto via `t("namespace.key")`
- [ ] Diccionario ES + EN actualizado
- [ ] Templates correctos (HeroSplit, CatalogLayout, etc.)
- [ ] Responsive siguiendo breakpoints del design system

---

## Accesibilidad y performance

- [ ] Focus visible en interactivos
- [ ] Contraste WCAG AA verificado
- [ ] Touch targets ≥ 44px en mobile
- [ ] `alt` en imágenes, `aria-label` en icon-only
- [ ] `backdrop-blur` solo en elementos fijos (no scroll containers)
- [ ] Imágenes con `loading="lazy"` donde aplica

---

## Entrega

- [ ] Código funcional y compilable
- [ ] Sin archivos markdown no solicitados
- [ ] WORKLOG actualizado si tarea significativa (AutoDrive)