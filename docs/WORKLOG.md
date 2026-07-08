# AutoDrive · Worklog

> Bitácora cronológica del proyecto. Más reciente arriba.
> Gestionada con el skill `autodrive-worklog`.

## Estado del proyecto

Plataforma de venta de **autos y autopartes** (baterías/fusibles) en **Next.js 16 (App
Router) + TypeScript**, con **Clean Architecture + Feature-Driven** y un **sistema de
diseño Atomic Design** (`src/ui`). Estado con Zustand. **Multilenguaje ES/EN** sin
dependencias (contexto i18n en `src/core/i18n`). Datos vía **datasources mock in-memory**
(lista para conectar API REST/FastAPI cambiando 1 línea en cada `di.ts`). Compila y
buildea sin errores. **Dev/Prod corren en el puerto 3001** (`npm run dev`).

**Módulos:**
- `vehicles_catalog` — landing moderna + catálogo con filtros + detalle de auto.
- `parts_marketplace` — **marketplace de autopartes** estilo e-commerce con filtros largos
  (12 categorías: motores, llantas, asientos, baterías, fusibles, frenos, suspensión,
  aceites, luces, filtros, carrocería, audio), orden, búsqueda y detalle de producto.
- `search_vehicle_parts` — buscador guiado por pasos (Marca→Modelo→Año→Categoría).
- `admin_dashboard` — panel con KPIs, gráfico de barras e inventario editable.

**Rutas:** `/` · `/catalogo` · `/catalogo/[id]` · `/autopartes` · `/autopartes/[id]` ·
`/buscador` · `/admin`.

## Pendientes / Backlog

- [ ] Backend FastAPI real implementando el contrato de `autodrive-architecture` (skill).
- [ ] Autenticación y protección de `/admin` (JWT).
- [ ] Carrito y flujo de checkout.
- [ ] Imágenes reales de autos (hoy se usan gradientes generados).
- [ ] Persistencia de inventario (hoy es mock en memoria).
- [ ] Tests unitarios de los use cases del dominio.

## Entradas

### 2026-06-22 — Reorganización a monorepo (frontend/ + backend/)

- **Qué:** Movida toda la app Next.js a `frontend/` para separar frontend y backend con
  claridad. La raíz queda como monorepo:
  ```
  /frontend  (Next.js: src, config, package.json, node_modules)
  /backend   (ya existía)
  /docs /.claude /.agents /CLAUDE.md /skills-lock.json  (tooling a nivel proyecto)
  ```
- **Movidos a `frontend/`:** `src`, `.next`, `node_modules`, `package.json`,
  `package-lock.json`, `tsconfig.json`, `next.config.mjs`, `next-env.d.ts`, `.env.local(.example)`,
  `.gitignore`, `README.md`.
- **Sin cambios en alias:** `@ui/@core/@features/@theme` resuelven vía `./src/*` relativo al
  `tsconfig.json` (ahora en `frontend/`), así que no hubo que tocar imports.
- **Actualizado:** `CLAUDE.md` (rutas `src/` → `frontend/src/`, nota de estructura y comando
  `cd frontend && npm run dev`); nuevo `README.md` raíz describiendo el monorepo.
- **Cómo correr ahora:** `cd frontend && npm run dev` (puerto 3001).
- **Verificado:** `next build` OK (9 rutas) y dev server → 200 desde la nueva ubicación.
- **Nota:** algunos SKILL.md aún citan rutas `src/...`; léanse como `frontend/src/...`.

### 2026-06-22 — Interfaz de venta estilo Brator (/autopartes)

- **Qué:** Rediseño de la tienda de autopartes siguiendo `autodrive-ui` → `venta-autos-brator`:
  - `PartsHero` (template `HeroSplit`): headline "Refacciones originales / para tu **vehículo**"
    con acento cyan, CTA "Comprar ahora", stats y visual.
  - `TrustBar` (template `FeatureGrid`): 4 beneficios (envío, calidad, soporte, devoluciones).
  - `CategoryTabs`: tabs horizontales (Todos + 12 categorías con conteo), selección única
    sincronizada con el filtro de categoría (estilo "Featured Product" de Brator).
  - `PartCard` pulida: etiqueta de categoría en cyan arriba del nombre + rating bajo el título.
  - `PartsMarketplace` recompuesto: Hero → TrustBar → guía compat. → promos → Tabs → grid+sidebar.
- **Fix:** añadido alias bare `@ui` en `tsconfig.json` (`./src/ui/index.ts`); los templates
  documentan `import { … } from "@ui"` pero solo existía `@ui/*` → Turbopack no resolvía.
- **Dónde:** `src/features/parts_marketplace/presentation/components/{PartsHero,TrustBar,CategoryTabs,PartsMarketplace,PartCard}.tsx`,
  `…/styles/marketplace.css`, `src/core/i18n/dictionaries.ts` (market hero/all + namespace `trust`), `tsconfig.json`.
- **i18n:** `market.heroTitleA/heroTitleB/heroAccent/heroCta/all`, namespace `trust` (ES/EN).
- **Capa:** presentation + ui (templates) + i18n. `next build` OK (8 rutas); `/autopartes` → 200.

### 2026-06-22 — Stack UI para Claude: skills + templates + orquestador

- **Qué:**
  - Skill maestro `autodrive-ui` en `.claude/skills/` (orquesta todo el stack UI).
  - `CLAUDE.md` en raíz: instrucciones para que Claude lea skills antes de codear UI.
  - Templates premium en `src/ui/templates/` (`HeroSplit`, `CollectionView`, `CatalogLayout`,
    `CTABand`, `FeatureGrid`, etc.) + `templates.css` global.
  - Skills locales: `ui-ux-builder`, `ui-templates`, `interfaces-espectaculares`.
  - Molecules: `EmptyState`, `ErrorState`. Barrel `@ui` actualizado.
- **Uso:** `/autodrive-ui` o pedir "interfaz moderna" → Claude lee design-system +
  ui-ux-builder + ui-templates (y premium si aplica).
- **Dónde:** `CLAUDE.md`, `.claude/skills/autodrive-ui/`, `src/ui/templates/`, `skills-lock.json`.
- **Capa:** skills + presentation (@ui templates).

### 2026-06-08 — Skills de frontend/diseño (skills.sh, 3ª tanda)

- **Qué:** Instaladas 4 skills:
  - `vercel-react-best-practices` — performance React/Next.js (Vercel Eng). (Safe)
  - `vercel-composition-patterns` — patrones de composición React 19 (compound, render
    props, context) para APIs reutilizables. (Safe)
  - `design-taste-frontend` (leonxlnx) — "anti-slop": infiere la dirección de diseño y
    entrega UIs no plantilladas; audit-first en rediseños. (Safe)
  - `extract-design-system` (arvindrk) — extrae primitivas de diseño de un sitio público y
    genera tokens de arranque.
- **Seguridad:** `extract-design-system` salió **Med Risk / 1 alert**. Revisada: solo 3
  markdown (SKILL.md + references), sin scripts/binarios. El riesgo es de USO: su workflow
  corre `npx extract-design-system <url>` + `npx playwright install chromium` (paquete de
  terceros + navegador headless para scrapear). Se conserva como referencia; **NO ejecutar
  ese workflow sin OK explícito del usuario**.
- **Dónde:** `.agents/skills/<skill>/` con symlink en `.claude/skills/`.
- **Estado del arsenal UI/UX:** 11 skills (1 propia + 10 externas). Set considerado completo;
  el siguiente paso recomendado es APLICARLAS, no seguir añadiendo.
- **Capa:** skills.

### 2026-06-08 — Más skills de diseño UI/UX (skills.sh, 2ª tanda)

- **Qué:** Instaladas 3 skills de diseño para elevar el look de la plataforma:
  - `high-end-visual-design` (leonxlnx/taste-skill) — diseñar "como agencia premium":
    fuentes, espaciado, sombras, estructura de cards y animaciones que se sienten caras;
    bloquea defaults genéricos. (Safe / 0 alerts / Low Risk)
  - `emil-design-eng` (emilkowalski/skill) — design engineering: craft de micro-interacciones
    y animación. (Safe / 0 alerts / Low Risk)
  - `ui-ux-pro-max` (nextlevelbuilder) — inteligencia UI/UX (50+ estilos, 161 paletas, 57
    pares tipográficos, 99 guías UX, charts) multi-stack.
- **Seguridad:** `ui-ux-pro-max` salió **High Risk** en el análisis heurístico de contenido
  (Socket 0 alerts, Snyk Low Risk). **Revisada manualmente**: SKILL.md (658 líneas) es guía
  de diseño benigna, sin `curl`/`fetch`/`eval`/exfiltración/secretos. Los archivos `data` y
  `scripts` son punteros relativos a recursos del repo (no presentes, inofensivos). Se
  conserva; el flag se considera falso positivo por sus verbos de acción amplios.
- **Dónde:** `.agents/skills/<skill>/` con symlink en `.claude/skills/`.
- **Prioridad:** ante conflicto de criterio, manda `autodrive-design-system` (tokens/Atomic
  Design/layout del proyecto); estas aportan "ojo" visual y craft.
- **Capa:** skills.

### 2026-06-08 — Skills externas de UI/UX instaladas (skills.sh)

- **Qué:** Instaladas 3 skills públicas de UI/UX/Next.js vía el CLI oficial `npx skills add`
  (todas pasaron la evaluación de seguridad: Safe / 0 alerts / Low Risk):
  - `frontend-design` (anthropics/skills) — interfaces frontend distintivas, evita estética
    genérica de IA; tipografía, theming por variables CSS, motion, composición.
  - `web-design-guidelines` (vercel-labs/agent-skills) — revisión de UI contra Web Interface
    Guidelines (accesibilidad, UX, best practices).
  - `next-best-practices` (vercel-labs/next-skills) — buenas prácticas Next.js (RSC, data
    patterns, async APIs, metadata, imágenes/fuentes, bundling).
- **Dónde:** instaladas en `.agents/skills/<skill>/` y symlinkeadas en `.claude/skills/`.
- **Cómo usarlas:** son complementarias a `autodrive-design-system` (que manda en tokens,
  Atomic Design y layout del proyecto). Usar `frontend-design` para pulido visual,
  `web-design-guidelines` para auditar UI/accesibilidad, `next-best-practices` para dudas de
  Next.js. Ante conflicto, prevalecen las convenciones de `autodrive-design-system`.
- **Capa:** skills.

### 2026-06-08 — Skill UI/UX ampliado (guía de layout y composición)

- **Qué:** Expandido `autodrive-design-system` a una guía UI/UX completa para "colocar bien"
  cualquier elemento: sistema de layout y escala de espaciado, grids `auto-fill`, tabla de
  breakpoints reales del código, catálogo `@ui` (atoms→molecules→organisms→templates) con
  cuándo usar cada componente, recetas de layout por tipo de página (hero, categorías,
  grilla de productos, sidebar de filtros, fila de KPIs), estados obligatorios
  (loading/vacío/error), reglas de i18n, animación, accesibilidad, anti-patrones y checklist.
- **Dónde:** `.claude/skills/autodrive-design-system/SKILL.md`.
- **Por qué:** que el trabajo visual futuro sea consistente y bien estructurado por defecto.
- **Capa:** skills.

### 2026-06-08 — Rediseño visual landing + marketplace (referencias e-commerce)

- **Qué:** Rediseño inspirado en referencias de tiendas de autopartes/rental:
  1. **Hero pro** (`LandingHero`): layout 2 columnas — texto/CTAs + visual con tarjeta de
     gradiente, auto flotante y chips (🔋12V, 🛞R16, ⚙️2.0L, 🛡️12m).
  2. **Categorías populares** (`PopularCategories`): grilla de tiles con icono, nombre y
     conteo de artículos; cada tile enlaza a `/autopartes?cat=<categoria>` (pre-filtra).
  3. **Banners promocionales** (`DiscountBanners`): envío gratis / hasta -50% / garantía,
     usados en landing y en el marketplace.
  4. **¿Por qué elegirnos?** (`WhyChooseUs`): grid de beneficios con iconos circulares.
  5. **Tarjeta de auto** rediseñada con fila de specs e iconos (⛽/⚙️/👤) y botón primario.
  6. Pre-filtrado del marketplace vía `?cat=` (lectura de query sin Suspense) + `init(preset)`.
  7. i18n: namespaces `home`, `promo`, `why` (ES/EN). Estilos `home.css`.
- **Dónde:** `src/features/vehicles_catalog/presentation/components/{LandingHero,DiscountBanners,WhyChooseUs,VehicleCard}.tsx`,
  `src/features/vehicles_catalog/presentation/styles/home.css`,
  `src/features/parts_marketplace/presentation/components/{PopularCategories,PartsMarketplace}.tsx`,
  `src/app/page.tsx`, `src/core/i18n/dictionaries.ts`.
- **Por qué:** acercar la UI a un look e-commerce premium según las referencias del usuario.
- **Capa:** presentation + ui + i18n. Composición cross-feature vía el `di` público del módulo.
- **Verificado:** `next build` OK (8 rutas); landing con `hero-pro/cat-tiles/promo-row/why-grid`;
  `/autopartes?cat=engine` → 200.

### 2026-06-08 — Marketplace de autopartes (estilo e-commerce, filtros largos)

- **Qué:** Nuevo feature `parts_marketplace` (Clean Architecture completa) con UX tipo
  Mercado Libre/Amazon:
  1. **Dominio:** `MarketplacePart` (precio/descuento, condición, rating, envío, garantía,
     compatibilidad, specs), `PartFilters`/`PartFacets`, use cases `SearchParts`
     (filtro + orden), `GetPartFacets`, `GetPartById`.
  2. **Datos:** DTO + mapper + datasource (HTTP + Mock con 24 piezas en 12 categorías:
     motores, llantas, asientos, baterías, fusibles, frenos, suspensión, aceites, luces,
     filtros, carrocería, audio) + repoImpl + `di.ts`.
  3. **Presentación:** store Zustand (toggles, rango, compatibilidad, orden, búsqueda),
     `PartsFilters` (sidebar largo con checkboxes, selects, switches), `PartCard`
     (descuento, precio tachado, envío, garantía, rating), `PartsMarketplace`
     (toolbar + orden + grid + banner a la búsqueda guiada), `PartDetail`.
  4. Atom nuevo `RatingStars` en `@ui`. Estilos `marketplace.css`.
  5. Rutas `/autopartes` y `/autopartes/[id]`; nav "Autopartes" añadido.
  6. i18n: namespaces `market`, `partCat`, `cond` (ES/EN).
- **Dónde:** `src/features/parts_marketplace/*`, `src/app/autopartes/*`,
  `src/ui/atoms/RatingStars.tsx`, `src/core/i18n/dictionaries.ts`, `src/ui/organisms/Navbar.tsx`.
- **Por qué:** la búsqueda de partes debía sentirse como un marketplace intuitivo con
  filtros amplios; el wizard de compatibilidad se conserva y se enlaza desde el banner.
- **Capa:** domain + data + presentation + ui + i18n.
- **Verificado:** `next build` OK (8 rutas); `/autopartes` y `/autopartes/[id]` → 200.

### 2026-06-08 — Atomic Design + i18n ES/EN + UI pulida + puerto 3001

- **Qué:**
  1. **Atomic Design** en `src/ui/`: atoms (Button, Badge, Chip, Card, Input, Skeleton,
     Logo, Eyebrow), molecules (StatCard, SearchInput, SpecBadge, SectionHeader,
     LanguageSwitcher), organisms (Navbar, Footer), template (PageShell), barrel `@ui`
     y README. Alias `@ui/*` en tsconfig.
  2. **Multilenguaje ES/EN** sin dependencias: `src/core/i18n` (dictionaries, I18nProvider
     con persistencia en localStorage, hook `useTranslation`). Conmutador en el Navbar.
  3. Refactor de toda la UI a client + `useTranslation` + atoms: landing, catálogo,
     filtros, tarjetas, detalle, buscador por pasos y panel admin completamente traducidos.
  4. Navbar/Footer globales movidos al layout; header con backdrop-blur y link activo.
  5. Puerto cambiado a **3001** en scripts `dev`/`start`.
  6. Eliminado `StockAlertCard` (reemplazado por el `StatCard` atómico de `@ui`).
- **Dónde:** `src/ui/*`, `src/core/i18n/*`, `src/app/layout.tsx`, `src/features/*/presentation/*`,
  `src/theme/globals.css`, `tsconfig.json`, `package.json`.
- **Por qué:** componibilidad y consistencia visual (Atomic Design) + alcance bilingüe.
  i18n por contexto cliente evita reestructurar rutas bajo `[locale]`.
- **Capa:** presentation + core (i18n) + ui (design system) + theme.
- **Verificado:** `next build` OK (6 rutas) y servidor en `http://localhost:3001`
  respondiendo 200 en `/`, `/catalogo`, `/buscador`, `/admin`, `/catalogo/[id]`.
- **Pendientes:** ver Backlog.

### 2026-06-08 — Skills del proyecto + página de autos moderna + admin pulido

- **Qué:**
  1. Creados 4 skills de proyecto en `.claude/skills/`: `autodrive-architecture`
     (Clean Architecture front+back y contrato de API), `autodrive-design-system`
     (tokens UI/UX y recetas), `autodrive-admin-panel` (patrones del panel),
     `autodrive-worklog` (esta bitácora).
  2. Catálogo de autos moderno: entidad `CatalogVehicle` enriquecida, use cases
     `FilterVehiclesUseCase` y `GetVehicleByIdUseCase`, dataset de 9 autos, explorador
     con filtros reactivos (marca/carrocería/combustible/precio + búsqueda), tarjetas
     con "foto" por gradiente y página de detalle.
  3. Landing renovada: hero con stats y animaciones de entrada; featured con `VehicleCard`.
  4. Panel admin pulido: `StockAlertCard` con icono/acento/glow, `MiniBarChart` (CSS puro),
     `AnalyticsPage` con KPIs, gráfico de más vendidos y acciones rápidas; skeletons de carga.
  5. Tema ampliado: animaciones (`fadeInUp`, `shimmer`, `pulse-glow`, `float`), utilidades
     (`.text-gradient`, `.section-eyebrow`, `.skeleton`, `.animate-in`).
- **Dónde:** `.claude/skills/*`, `src/features/vehicles_catalog/*`,
  `src/features/admin_dashboard/presentation/*`, `src/app/catalogo/*`, `src/theme/globals.css`.
- **Por qué:** elevar la plataforma a nivel "premium" manteniendo la separación estricta
  de capas; los skills fijan las convenciones para trabajo futuro consistente.
- **Capa:** presentation + domain + data + theme + skills.
- **Pendientes:** ver Backlog (backend real, auth, checkout, imágenes).

### 2026-06-08 — Scaffolding inicial (Clean Architecture)

- **Qué:** Proyecto Next.js + TypeScript con 3 módulos (search_vehicle_parts,
  admin_dashboard, vehicles_catalog), capa `core` (HttpClient, formatters, Result),
  tema `:root` (dark + cobalto + cyan), buscador de autopartes end-to-end y panel admin.
- **Dónde:** `src/core`, `src/theme`, `src/features/*`, `src/app/*`.
- **Por qué:** base desacoplada y escalable; datasources mock para correr sin backend.
- **Capa:** todas. Build verificado (4 rutas estáticas).
