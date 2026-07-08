# Tendencias UI 2026

Vocabulario visual para interfaces que se sienten actuales. Elige **1 tendencia principal**
por vista; máximo 2 si combinan naturalmente (ej. Dark Premium + Spatial Depth en AutoDrive).

---

## 1. Spatial Depth (Profundidad espacial)

**Qué es:** Interfaces con sensación de capas en eje Z. No flat design plano.

**Señales visuales:**
- Fondos con gradientes radiales sutiles (no blobs genéricos)
- Cards con `box-shadow` difuso + highlight inset
- Elementos que "flotan" sobre el fondo con separación clara
- Glows en accent color con baja opacidad

**AutoDrive:** `--bg-base` → `--bg-surface` → `--bg-elevated` + `--glow-primary`

**Evitar:** Sombras duras `rgba(0,0,0,0.5)`, elevación excesiva en todo.

---

## 2. Glass Evolved (Cristal evolucionado)

**Qué es:** Glassmorphism refinado — solo en elementos fijos o de alto contraste.

**Señales visuales:**
- `backdrop-blur` **solo** en nav, modales, overlays (nunca en scroll containers)
- Hairlines `border-white/10` o `ring-1 ring-white/5`
- Fondo semi-transparente sobre imagen o mesh gradient
- Texto siempre legible (contraste AA)

**Dónde aplicar:** Navbar flotante, command palette, tooltips, cards hero.

**Evitar:** Glass en cada card, blur en listas largas (mata performance móvil).

---

## 3. Bento Intelligence (Grids inteligentes)

**Qué es:** Grids asimétricos donde el tamaño de celda comunica jerarquía.

**Señales visuales:**
- Celdas `col-span-8` + `col-span-4` (no 3 columnas iguales)
- Una celda "hero" más grande que el resto
- Contenido variado por celda (imagen, stat, texto, CTA)
- Gap generoso (`gap-4` a `gap-6`)

**Mobile:** Todo a `grid-cols-1`, sin `col-span` overrides.

**Evitar:** Bento con celdas vacías; N items = N celdas siempre.

---

## 4. Typography-Led (Tipografía protagonista)

**Qué es:** El tipo hace el trabajo visual; menos decoración compensatoria.

**Señales visuales:**
- Display font en H1 (2–4rem+), tracking ajustado
- Contraste de peso: bold display + regular body
- Eyebrow pill antes de títulos (`text-[10px] uppercase tracking-widest`)
- Máximo 2 familias tipográficas

**Pares modernos (no defaults):**
- Display: Clash Display, Satoshi, Cabinet Grotesk, Plus Jakarta Sans
- Body: Geist, Inter Display (solo como body, no display), DM Sans

**Evitar:** Inter/Roboto/Arial como display; Fraunces/Instrument Serif como default.

---

## 5. Kinetic Micro (Micro-interacciones cinéticas)

**Qué es:** Motion en momentos de interacción, no en carga de toda la página.

**Señales visuales:**
- Hover: scale sutil (`scale-[1.02]`), translate en iconos anidados
- Active: `scale-[0.98]` en botones (feedback táctil)
- Focus: ring visible + ligero glow
- Entrada de sección: fade-up al entrar viewport (una vez)

**Frecuencia:** Si el usuario lo ve 100+ veces/día → sin animación.

**Evitar:** Marquee infinito, parallax pesado, scroll listeners en React.

---

## 6. Dark Premium (AutoDrive / automotriz)

**Qué es:** Tema oscuro con acentos neón y sensación tecnológica premium.

**Señales visuales:**
- Fondo `--bg-base` casi negro con tinte azul
- Accent `--accent-neon` (cyan) para CTAs y highlights
- `--primary-glow` (cobalto) para fondos y gradientes
- Bordes `--border` sutiles, radios `--radius-lg`

**Combinar con:** Spatial Depth + Kinetic Micro.

**Evitar:** Purple gradient slop; demasiados colores accent.

---

## 7. Soft Structuralism (Consumer / health / portfolio)

**Qué es:** Fondos claros o plateados, sombras ultra-difusas, tipografía bold.

**Señales visuales:**
- Fondo `#F8F9FB` o blanco con grain sutil
- Sombras ambient `shadow-[0_8px_40px_rgba(0,0,0,0.06)]`
- Cards flotantes sin bordes duros
- Espaciado generoso

**Evitar:** Beige + brass + espresso (cliché premium consumer).

---

## 8. Command-First UI (SaaS / power users)

**Qué es:** Interfaces donde el command palette / búsqueda global es ciudadano de primera clase.

**Señales visuales:**
- `Cmd+K` shortcut visible en search bar
- Atajos de teclado en acciones frecuentes
- Sidebar colapsable, densidad media-alta
- Sin animación en toggle de command palette

**Evitar:** Ocultar funcionalidad detrás de demasiados clicks.

---

## Matriz de combinación

| Proyecto | Tendencia 1 | Tendencia 2 (opcional) |
|----------|-------------|------------------------|
| AutoDrive / novacar | Dark Premium | Spatial Depth |
| SaaS B2B | Command-First | Soft Structuralism |
| Landing creativa | Typography-Led | Kinetic Micro |
| E-commerce premium | Bento Intelligence | Spatial Depth |
| Portfolio diseñador | Typography-Led | Glass Evolved |

---

## Anti-tendencias 2026 (ya pasaron de moda)

- Hero centrado con blob gradient morado
- 3 feature cards idénticas en fila
- Glassmorphism en todo
- Scroll hijacking
- Cursor personalizado que sigue el mouse
- "Scroll to explore" con flecha animada
- Neumorphism pesado
- Gradientes arcoíris en botones