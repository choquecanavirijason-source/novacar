# Pre-Flight Checklist · Interfaces Espectaculares

Ejecutar **antes de entregar**. Si un ítem falla, corregir antes de responder.

---

## Dirección y contexto

- [ ] Design Read declarado en una línea
- [ ] Diales (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`) explícitos
- [ ] Skills complementarias cargadas según contexto
- [ ] Modo detectado: greenfield / redesign-preserve / redesign-overhaul

---

## Anti-slop (cero tolerancia)

- [ ] Cero em-dashes (`—` o `–`) en texto visible
- [ ] Sin Inter/Roboto/Arial como font default
- [ ] Sin purple-gradient-slop ni beige+brass default en premium consumer
- [ ] Sin 3 feature cards idénticas en fila
- [ ] Sin div-based fake screenshots
- [ ] Sin iconos SVG dibujados a mano
- [ ] Sin "Elevate", "Seamless", "Next-Gen", "Revolutionize"
- [ ] Sin nombres genéricos (Jane Doe, John Smith, Acme Corp)
- [ ] Sin scroll cues ("Scroll to explore", flecha animada de mouse)
- [ ] Sin version labels en hero (BETA, v0.6) salvo brief de launch
- [ ] Sin section-number eyebrows (`001 · Capabilities`)

---

## Hero

- [ ] Cabe en viewport inicial sin scroll para ver CTA
- [ ] H1 máximo 2 líneas en desktop
- [ ] Subtexto máximo 20 palabras y 4 líneas
- [ ] Máximo 4 elementos de texto (eyebrow OR strip, H1, subtext, CTAs)
- [ ] Top padding máximo `pt-24` en desktop
- [ ] Logo wall / "Trusted by" DEBAJO del hero, no dentro
- [ ] Visual real (imagen, video, componente) — no solo gradient blob

---

## Layout y composición

- [ ] Mínimo 4 familias de layout distintas (en páginas de 8+ secciones)
- [ ] Máximo 2 zigzags image+text consecutivos
- [ ] Bento: N items = N celdas, sin celdas vacías
- [ ] Mínimo 2-3 celdas bento con variación visual
- [ ] Nav en una sola línea en desktop, altura ≤ 80px
- [ ] Mobile collapse explícito (`w-full`, `px-4`, sin overlaps/rotaciones)
- [ ] `min-h-[100dvh]` — nunca `h-screen`
- [ ] Máximo 1 eyebrow cada 3 secciones
- [ ] Máximo 1 marquee horizontal por página

---

## Color, tipo y forma

- [ ] Un solo accent color en toda la página
- [ ] Un sistema de border-radius consistente
- [ ] Tema locked: light OR dark OR auto — sin flip de sección
- [ ] Dark mode probado (si aplica)
- [ ] Contraste WCAG AA en botones (4.5:1) y formularios
- [ ] CTAs no wrap a 2+ líneas en desktop
- [ ] Sin CTAs duplicados con mismo intent ("Contact" + "Get in touch")

---

## Motion

- [ ] Cada animación justificada (jerarquía / storytelling / feedback / transición)
- [ ] Si `MOTION_INTENSITY > 4`, la página realmente se anima
- [ ] Curvas custom — no `ease-in-out` ni `linear` en UI principal
- [ ] No `transition: all`
- [ ] No `window.addEventListener('scroll')`
- [ ] Solo `transform` + `opacity` animados
- [ ] `prefers-reduced-motion` implementado
- [ ] GSAP con `start: "top top"` y cleanup (`ctx.revert()`)
- [ ] `backdrop-blur` solo en fixed/sticky

---

## Contenido y assets

- [ ] Imágenes reales (gen, picsum seed, o placeholders etiquetados)
- [ ] Logo wall con SVG reales (Simple Icons) o monogramas, no texto plano
- [ ] Quotes máximo 3 líneas con atribución completa
- [ ] Copy auditado: sin frases rotas o AI-hallucination
- [ ] Sin números fake-precise sin justificación (`92.7%`, `4.1×`)

---

## AutoDrive (si aplica)

- [ ] Tokens `:root` — cero colores hardcodeados
- [ ] Componentes `@ui` reutilizados antes de crear nuevos
- [ ] Todo texto via `t("key")` en ES + EN
- [ ] Escala de espaciado del design system respetada

---

## Técnico

- [ ] Motion/GSAP en client islands aislados
- [ ] Estados loading, empty, error donde aplica
- [ ] `useEffect` animations con cleanup
- [ ] Hero image con `priority` (LCP)
- [ ] Sin z-index arbitrarios (`z-50` spam)

---

## Resultado final

La impresión debe ser **"agencia de $150k"**, no **"template con buenas fuentes"**.

Si falla, iterar Fase 3-5 antes de entregar.