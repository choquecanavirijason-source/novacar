# Pre-Flight · Venta de Autos Brator

Ejecutar antes de entregar. Corregir todo lo que falle.

---

## Contexto

- [ ] Brator Read declarado
- [ ] Referencia visual revisada (`referencia-visual.md`)
- [ ] Skills cargadas: design-system, ui-templates, ui-ux-builder
- [ ] Modo: home completa / sección suelta / catálogo / detalle

---

## Estructura home (si aplica)

- [ ] PromoBanner strip superior
- [ ] Navbar con búsqueda + acciones
- [ ] HeroVehicle con foto real + headline 3 líneas + CTA visible sin scroll
- [ ] TrustBar 4 columnas
- [ ] VehicleFinder (año/marca/modelo/combustible)
- [ ] CategoryTiles (mínimo 6 categorías)
- [ ] FeaturedVehicles con tabs + grid
- [ ] PromoBento (2–4 banners)
- [ ] BrandCarousel (mínimo 8 marcas)
- [ ] BestSellers con countdown
- [ ] NewArrivals grid
- [ ] CTABand cierre

---

## Componentes

- [ ] VehicleCard: imagen, categoría, nombre, rating, precio, badge descuento
- [ ] Tabs de categoría con `Chip`
- [ ] Countdown funcional con cleanup
- [ ] VehicleFinder navega a catálogo con query params
- [ ] Hover en cards: scale sutil + imagen zoom
- [ ] Línea de acento bajo CTA hero (opcional Brator)

---

## Visual Brator adaptado

- [ ] Dark theme consistente
- [ ] Un accent dominante (`--accent-neon` o `--danger` para promos)
- [ ] Tipografía bold en headlines
- [ ] Nav uppercase en desktop
- [ ] Fotografía real de vehículos (no placeholders grises)
- [ ] Grid denso pero respirable (gap 18–20)

---

## AutoDrive (no negociable)

- [ ] Tokens `:root` — cero hex hardcodeados
- [ ] Componentes `@ui` usados donde existían
- [ ] `t("key")` en todo texto visible
- [ ] Diccionario ES + EN actualizado
- [ ] Estados loading / empty / error en grids async

---

## Responsive

- [ ] Hero: split → stack en mobile
- [ ] TrustBar: 4 → 2×2 en mobile
- [ ] VehicleFinder: fila → stack
- [ ] Grid vehículos: 5 → 3 → 1–2 cols
- [ ] BrandCarousel: scroll horizontal en todos los tamaños
- [ ] PromoBento: bento → 1 col mobile
- [ ] Touch targets ≥ 44px

---

## Accesibilidad

- [ ] Focus visible en tabs, cards, botones
- [ ] `alt` en imágenes de vehículos
- [ ] `aria-label` en icon-only buttons
- [ ] Countdown con `aria-live="polite"`
- [ ] Contraste WCAG AA
- [ ] Formulario finder con labels visibles

---

## Anti-slop

- [ ] Sin 3 cards idénticas sin variación
- [ ] Sin "Lorem ipsum" ni "Shop Now" hardcodeado
- [ ] Sin purple gradient slop
- [ ] Sin hero solo con blob gradient (necesita foto de auto)
- [ ] Sin nombres genéricos (Jane Doe, Acme)

---

## Entrega

- [ ] Código compilable
- [ ] WORKLOG actualizado si tarea significativa