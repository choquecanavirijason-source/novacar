# Recetas de Motion

Snippets listos para copiar. Aislar en client components (`'use client'`).

---

## 1. Scroll Reveal Stagger (Motion — ligero)

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export function RevealStagger({ children }: { children: React.ReactNode[] }) {
  const reduce = useReducedMotion();
  return (
    <div className="grid gap-6">
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            delay: i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
```

---

## 2. Hero Load Orchestration

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HeroReveal({ parts }: { parts: React.ReactNode[] }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{parts}</>;

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {parts.map((part, i) => (
        <motion.div key={i} variants={item}>{part}</motion.div>
      ))}
    </motion.div>
  );
}
```

---

## 3. Magnetic Button (sin useState)

```tsx
"use client";
import { motion, useMotionValue, useSpring } from "motion/react";

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  return (
    <motion.button
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.2);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="px-6 py-3 rounded-full active:scale-[0.98]"
    >
      {children}
    </motion.button>
  );
}
```

---

## 4. Sticky Scroll Stack (GSAP)

```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function StickyStack({ cards }: { cards: React.ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>(".stack-card");
      els.forEach((card, i) => {
        if (i === els.length - 1) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: els[els.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: els[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref}>
      {cards.map((card, i) => (
        <div key={i} className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center">
          {card}
        </div>
      ))}
    </div>
  );
}
```

**Crítico:** `start: "top top"`, cleanup con `ctx.revert()`.

---

## 5. Horizontal Pan (GSAP)

```tsx
"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function HorizontalPan({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={wrap} className="overflow-hidden">
      <div ref={track} className="flex h-[100dvh] items-center">
        {children}
      </div>
    </section>
  );
}
```

---

## 6. CSS Scroll-Driven Animation (sin JS)

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(2rem); }
  to   { opacity: 1; transform: translateY(0); }
}

.reveal {
  animation: fade-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 40%;
}

@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; opacity: 1; transform: none; }
}
```

Ideal para listas simples sin dependencia de GSAP.

---

## 7. Nav Stagger Reveal

```tsx
const linkVariants = {
  hidden: { opacity: 0, y: 48 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

{links.map((link, i) => (
  <motion.a
    key={link.href}
    custom={i}
    variants={linkVariants}
    initial="hidden"
    animate={isOpen ? "show" : "hidden"}
  >
    {link.label}
  </motion.a>
))}
```

---

## Decision framework (de emil-design-eng)

| Frecuencia de uso | Decisión |
|-------------------|----------|
| 100+/día (atajos, toggles) | Sin animación |
| Decenas/día (hovers, nav) | Mínima o ninguna |
| Ocasional (modales, drawers) | Animación estándar |
| Rara (onboarding, celebración) | Delight permitido |

**Nunca animar acciones de teclado.**

---

## Performance

- Animar solo `transform` y `opacity`
- `backdrop-blur` solo en fixed/sticky (nav, overlays)
- `will-change: transform` solo durante animación activa
- Lazy-load GSAP/Three.js — no above-the-fold
- No mezclar GSAP y Motion en el mismo component tree