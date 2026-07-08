# Accesibilidad UI

Objetivo: **WCAG 2.1 AA** mínimo en todo el proyecto.

---

## Contraste de color

| Elemento | Ratio mínimo |
|----------|--------------|
| Texto body (< 18px) | 4.5:1 |
| Texto grande (≥ 18px bold o ≥ 24px) | 3:1 |
| Iconos e UI components | 3:1 |
| Focus indicator | 3:1 contra adyacente |

### AutoDrive tokens verificados

- `--text-primary` sobre `--bg-base` → debe pasar AA
- `--text-muted` solo para texto secundario, nunca CTAs
- Placeholders: no más claros que 4.5:1 (muchas UIs fallan aquí)

---

## Teclado

- [ ] Todo interactivo alcanzable con Tab
- [ ] Orden de tab sigue orden visual (izq→der, arriba→abajo)
- [ ] Enter/Space activan botones y chips
- [ ] Escape cierra modales y dropdowns
- [ ] Focus trap en modales (Tab no sale del modal)
- [ ] Skip link "Saltar al contenido" en layout raíz (opcional pero recomendado)

### Focus visible

```css
:focus-visible {
  outline: 2px solid var(--accent-neon);
  outline-offset: 2px;
}
```

- Nunca `outline: none` sin alternativa
- `:focus-visible` no `:focus` (evita ring en click de mouse)

---

## ARIA esencial

| Situación | Atributo |
|-----------|----------|
| Botón solo icono | `aria-label="Cerrar"` |
| Toggle / chip | `aria-pressed="true/false"` |
| Modal | `role="dialog"`, `aria-labelledby`, `aria-modal="true"` |
| Resultados dinámicos | `aria-live="polite"` |
| Error urgente | `role="alert"` |
| Loading | `aria-busy="true"` en contenedor |
| Tab activo | `aria-selected="true"` |
| Expandible | `aria-expanded="true/false"` |
| Contador | `aria-label` descriptivo, no solo el número |

### Regla de oro

**No uses ARIA si el HTML semántico ya comunica el rol.**

```html
<!-- Mal -->
<div role="button" onClick={...}>Click</div>

<!-- Bien -->
<button onClick={...}>Click</button>
```

---

## Imágenes y media

- `alt` descriptivo en imágenes informativas
- `alt=""` en imágenes decorativas
- Videos: subtítulos o transcripción
- Iconos decorativos: `aria-hidden="true"`

---

## Motion y vestibular

```tsx
import { useReducedMotion } from "motion/react";

const reduce = useReducedMotion();
const transition = reduce ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] };
```

- `prefers-reduced-motion: reduce` → sin animaciones automáticas
- Parallax, scroll-hijack, auto-play → desactivar
- CSS: `@media (prefers-reduced-motion: reduce) { animation: none; }`

---

## Touch targets

- Mínimo **44×44px** área clickeable
- Spacing entre targets ≥ 8px
- En móvil: botones `size="md"` mínimo, no solo iconos pequeños

---

## Formularios accesibles

Ver `formularios.md`. Resumen:

- Label asociado con `htmlFor`/`id`
- Errores con `aria-invalid` + `aria-describedby`
- Grupos con `fieldset`/`legend`
- `required` en campos obligatorios
- No depender solo de color para errores (icono + texto)

---

## Checklist rápido pre-entrega

```
□ Contraste AA en texto, botones, placeholders
□ Focus visible en todos los interactivos
□ Navegable 100% con teclado
□ aria-label en iconos sin texto
□ aria-live en zonas dinámicas
□ Imágenes con alt apropiado
□ prefers-reduced-motion respetado
□ Touch targets ≥ 44px en móvil
□ Estado no comunicado solo con color
□ HTML semántico antes que ARIA redundante
```

---

## Herramientas de verificación

- Lighthouse Accessibility audit
- axe DevTools (browser extension)
- Navegación solo con teclado (Tab through entire page)
- VoiceOver / NVDA spot check en flujos críticos