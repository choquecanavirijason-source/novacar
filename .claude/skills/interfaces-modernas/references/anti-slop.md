# Anti-Slop · Interfaces Modernas

Patrones que hacen que la UI se vea "generada por IA". **Cero tolerancia** en entregas finales.

---

## Tipografía

| Prohibido | Alternativa |
|-----------|-------------|
| Inter, Roboto, Arial como display | Clash Display, Satoshi, Plus Jakarta Sans, Geist |
| Misma font en todo | Display bold + body regular |
| H1 de 5+ líneas | Máximo 2 líneas en desktop |
| Em-dash (`—`) en copy | Punto, coma o dos puntos |

---

## Color

| Prohibido | Alternativa |
|-----------|-------------|
| Purple gradient on white | Un accent dominante + neutros |
| Rainbow gradients en botones | Gradiente de marca o sólido |
| 5+ colores accent | 1 accent + estados (success/warning/danger) |
| Hex hardcodeados (AutoDrive) | Tokens `var(--*)` |

---

## Layout

| Prohibido | Alternativa |
|-----------|-------------|
| 3 feature cards idénticas | Bento asimétrico o variación visual |
| Hero centrado + blob gradient | Hero split con visual real |
| Nav pegada al top edge-to-edge | Floating island nav (marketing) |
| `h-screen` en secciones | `min-h-[100dvh]` |
| Overlaps/rotaciones en mobile | Stack vertical limpio |

---

## Contenido

| Prohibido | Alternativa |
|-----------|-------------|
| "Elevate", "Seamless", "Next-Gen" | Copy específico del producto |
| Jane Doe, John Smith, Acme Corp | Nombres reales o genéricos del dominio |
| "Scroll to explore" + flecha | Dejar que el contenido invite al scroll |
| Section numbers (`001 · Features`) | Eyebrow descriptivo |
| Version labels en hero (BETA, v0.6) | Solo si el brief es launch |

---

## UI fake

| Prohibido | Alternativa |
|-----------|-------------|
| Screenshots hechos con `<div>` | Imágenes reales o slots etiquetados |
| Iconos SVG dibujados a mano | Librería consistente (Lucide, Phosphor) |
| Gráficos decorativos sin datos | Stats reales o quitar |
| Placeholder "Lorem ipsum" visible | `t("key")` con copy del dominio |

---

## Motion

| Prohibido | Alternativa |
|-----------|-------------|
| `transition: all` | Propiedades específicas |
| Marquee x2 en misma página | Máximo 1 marquee |
| Parallax con scroll listener | CSS scroll-driven o IntersectionObserver |
| Animación en acciones 100+/día | Sin animación (command palette, nav toggle) |
| `useState` para mouse position | CSS hover o nada |

---

## Accesibilidad (no negociable aunque sea "moderno")

- Focus visible en todo interactivo
- Contraste WCAG AA en texto y botones
- `prefers-reduced-motion` respetado
- Touch targets ≥ 44px en mobile
- `alt` en imágenes, `aria-label` en icon-only buttons

---

## Test rápido anti-slop (30 segundos)

Pregúntate antes de entregar:

1. ¿Se parece a cada landing de SaaS de Dribbble? → Cambiar layout o tipografía
2. ¿Hay más de 1 color accent fuerte? → Reducir a 1
3. ¿El hero necesita scroll para ver el CTA? → Acortar copy o padding
4. ¿Hay 3 cards iguales en fila? → Variar tamaño o contenido
5. ¿Hay animación en algo que el usuario usa constantemente? → Quitarla