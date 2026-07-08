# Catálogo de Patrones Visuales Premium

Vocabulario de patrones. Implementar con Tailwind + Motion salvo indicación contraria.

---

## Heroes

### Asymmetric Split Hero
```
[Texto 50%]  |  [Asset 50%]
Eyebrow (opcional, max 1)
H1 max 2 líneas
Subtext max 20 palabras
CTA primary + secondary
```
- Mobile: asset arriba, texto abajo, `w-full`
- Motion: asset fade-up con delay, texto stagger

### Kinetic Type Hero
- Tipografía masiva como visual principal (`text-6xl` → `text-9xl`)
- Palabras clave con italic/bold del MISMO font (no mezclar familias)
- Fondo: mesh gradient o video mask
- Motion: reveal por palabra con `staggerChildren`

### Curtain Reveal Hero
- Contenido inicialmente oculto tras overlay
- Scroll o click revela con `clip-path` o `translateY`
- Solo si `MOTION_INTENSITY >= 7`

### Video Mask Hero
- Texto como máscara sobre video (`background-clip: text` + video detrás)
- Fallback: imagen estática con overlay

---

## Navegación

### Floating Island Nav
```tsx
<nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50
  flex items-center gap-1 px-2 py-2
  rounded-full backdrop-blur-2xl
  bg-white/10 dark:bg-black/40
  ring-1 ring-white/10 shadow-lg">
  {/* logo + links + CTA pill */}
</nav>
```

### Hamburger Morph
- 2-3 líneas → rotan a X con `rotate-45` / `-rotate-45`
- Menu overlay: `backdrop-blur-3xl`, links con stagger reveal
- `translate-y-12 opacity-0` → `translate-y-0 opacity-100`

### Mega Menu Reveal
- Full-screen dropdown con fade stagger en categorías
- Solo para sitios con mucha IA

---

## Cards y contenedores

### Double-Bezel Card
```tsx
<div className="p-1.5 rounded-[2rem] bg-black/5 ring-1 ring-black/5">
  <div className="rounded-[calc(2rem-0.375rem)] bg-zinc-900 p-6
    shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
    {/* contenido */}
  </div>
</div>
```

### Spotlight Border Card
- Border iluminado bajo cursor (gradient radial en `--mouse-x/y`)
- Implementar con `useMotionValue` + `useTransform`, no `useState`

### Glass Panel (web approximation)
```css
.glass {
  border: 1px solid rgb(255 255 255 / 0.18);
  background: rgb(255 255 255 / 0.08);
  backdrop-filter: blur(24px) saturate(180%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.22);
}
```
- Fallback sólido bajo `prefers-reduced-transparency`

### Parallax Tilt Card
- `rotateX/Y` basado en posición del mouse
- Max tilt: ±8deg. Desactivar en mobile y reduced-motion

---

## Grids y layouts

### Bento Asimétrico
```tsx
<div className="grid grid-cols-12 gap-4 md:gap-6">
  <div className="col-span-12 md:col-span-8 md:row-span-2">{/* hero cell */}</div>
  <div className="col-span-12 md:col-span-4">{/* cell 2 */}</div>
  <div className="col-span-12 md:col-span-4">{/* cell 3 */}</div>
</div>
```
- N items → N celdas. Sin celdas vacías.
- Mínimo 2-3 celdas con variación visual (imagen, gradiente, patrón)

### Masonry
- `columns-1 md:columns-2 lg:columns-3 gap-6`
- Items con `break-inside-avoid`

### Editorial Split
```tsx
<div className="grid md:grid-cols-2 gap-12 items-center">
  <h2 className="text-5xl md:text-7xl tracking-tighter">...</h2>
  <div className="flex gap-4 overflow-x-auto snap-x">{/* pills/cards */}</div>
</div>
```

---

## CTAs y botones

### Button-in-Button
```tsx
<button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black
  active:scale-[0.98] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
  <span>Explorar</span>
  <span className="flex items-center justify-center w-8 h-8 rounded-full
    bg-black/5 group-hover:translate-x-1 group-hover:-translate-y-px transition-transform">
    <ArrowIcon />
  </span>
</button>
```

### Directional Hover Fill
- Fill entra desde el lado del cursor (top/right/bottom/left)
- CSS con `--x` `--y` o 4 pseudo-elementos

---

## Galerías y media

### Accordion Image Slider
- Tiras estrechas que expanden en hover (`flex` con `flex-grow`)
- Mobile: scroll horizontal snap

### Coverflow Carousel
- Cards con `rotateY` y `translateZ` en perspectiva
- Lazy-load imágenes fuera del viewport

### Hover Image Trail
- Imágenes aparecen en posición del cursor al mover
- Solo `MOTION_INTENSITY >= 8`, con throttle

---

## Fondos y atmósfera

### Mesh Gradient
```css
background:
  radial-gradient(ellipse at 20% 50%, rgba(120,80,255,0.15), transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(0,200,180,0.12), transparent 50%),
  var(--bg-base);
```

### Film Grain
```css
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* noise pattern */
}
```
- Solo en elemento `fixed`, nunca en contenedores con scroll

### Grid decorativo
- Prohibido como decoración vacía
- Permitido solo si organiza contenido real

---

## Selección por dial

| Patrón | VARIANCE min | MOTION min |
|--------|-------------|------------|
| Asymmetric Split Hero | 6 | 3 |
| Kinetic Type Hero | 8 | 7 |
| Bento Asimétrico | 7 | 4 |
| Z-Axis Cascade | 8 | 5 |
| Sticky Scroll Stack | 7 | 8 |
| Horizontal Pan | 8 | 8 |
| Parallax Tilt Card | 6 | 6 |
| Hover Image Trail | 9 | 8 |

No usar patrones por encima de lo que los diales permiten.