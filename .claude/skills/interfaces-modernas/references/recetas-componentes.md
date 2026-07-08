# Recetas de Componentes Modernos

Snippets listos para copiar/adaptar. En AutoDrive, mapea colores a tokens `:root`
y usa componentes `@ui` cuando existan equivalentes.

---

## 1. Double-Bezel Card

```tsx
<div className="rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10">
  <div className="rounded-[calc(2rem-0.375rem)] bg-[var(--bg-elevated)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
    {/* contenido */}
  </div>
</div>
```

**Cuándo:** Cards premium, imágenes destacadas, stats importantes.

---

## 2. Floating Island Nav

```tsx
<header className="sticky top-0 z-40 px-4 pt-4">
  <nav className="mx-auto flex w-max items-center gap-6 rounded-full border border-white/10 bg-[var(--bg-overlay)]/80 px-6 py-3 backdrop-blur-xl">
    <Logo />
    <NavLinks className="hidden md:flex" />
    <CTA size="sm" />
    <MobileMenu className="md:hidden" />
  </nav>
</header>
```

**Cuándo:** Landings, marketing. No en admin denso.

---

## 3. Button-in-Button CTA

```tsx
<button className="group inline-flex items-center gap-3 rounded-full bg-[var(--accent-neon)] px-6 py-3 text-sm font-medium text-[var(--bg-base)] transition-transform active:scale-[0.98]">
  <span>{t("cta.explore")}</span>
  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-px">
    <ArrowIcon className="h-4 w-4" />
  </span>
</button>
```

**Cuándo:** CTA primario con icono de flecha. Icono siempre anidado, nunca suelto.

---

## 4. Eyebrow Pill

```tsx
<span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
  {t("section.eyebrow")}
</span>
```

**Cuándo:** Antes de H1/H2. Máximo 1 cada 3 secciones.

---

## 5. Fade-Up on View (Motion)

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function FadeUp({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

**Cuándo:** Entrada de secciones al scroll. Una vez por elemento (`viewport.once`).

---

## 6. Product Card Moderna

```tsx
<article className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] transition-transform hover:scale-[1.02]">
  <div className="relative aspect-[4/3] overflow-hidden">
    <img
      src={image}
      alt={title}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />
    <Badge className="absolute left-3 top-3">{badge}</Badge>
  </div>
  <div className="space-y-2 p-5">
    <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
    <p className="text-sm text-[var(--text-muted)]">{subtitle}</p>
    <div className="flex items-center justify-between pt-2">
      <Price value={price} />
      <Button variant="ghost" size="sm">{t("action.view")}</Button>
    </div>
  </div>
</article>
```

**Cuándo:** Catálogos, grids de productos. AutoDrive: preferir `@ui` Card existente.

---

## 7. Search Bar con Command Hint

```tsx
<div className="relative">
  <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
  <input
    type="search"
    placeholder={t("search.placeholder")}
    className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] py-3 pl-11 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-neon)]/40"
  />
  <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-0.5 text-[10px] text-[var(--text-muted)] md:inline">
    ⌘K
  </kbd>
</div>
```

**Cuándo:** SaaS, catálogos con búsqueda global.

---

## 8. Stat Card con Glow

```tsx
<div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-6">
  <p className="text-sm text-[var(--text-muted)]">{label}</p>
  <p className="mt-1 text-3xl font-bold tracking-tight text-[var(--text-primary)]">{value}</p>
  {delta && (
    <p className={`mt-2 text-sm ${delta > 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
      {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}%
    </p>
  )}
</div>
```

---

## 9. Mesh Gradient Background (sutil)

```css
.mesh-bg {
  background-color: var(--bg-base);
  background-image:
    radial-gradient(ellipse 80% 60% at 20% 30%, var(--primary-soft), transparent),
    radial-gradient(ellipse 60% 50% at 80% 70%, var(--accent-soft), transparent);
}
```

**Cuándo:** Hero, secciones CTA. Un solo mesh por página, no en todo el fondo.

---

## 10. Skeleton Loading

```tsx
<div className="animate-pulse space-y-4">
  <div className="h-48 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)]" />
  <div className="h-4 w-3/4 rounded bg-[var(--bg-elevated)]" />
  <div className="h-4 w-1/2 rounded bg-[var(--bg-elevated)]" />
</div>
```

**Cuándo:** Todo fetch async. AutoDrive: usar `Skeleton` de `@ui`.

---

## Curvas de motion permitidas

```css
/* Entrada suave */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* Salida con masa */
--ease-out-quart: cubic-bezier(0.32, 0.72, 0, 1);

/* Spring (Motion) */
{ type: "spring", stiffness: 100, damping: 20 }
```

**Prohibido:** `transition: all`, `ease-in-out`, `linear` en UI principal.