# NOVACAR — Arquitectura del Frontend

> Documento vivo. Describe **cómo está construido y cómo funciona hoy** el frontend
> (`novacar/frontend`), con foco especial en **las tablas administrativas** y en el
> **módulo de vehículos**.
>
> Última revisión del código: 2026-09-09.

---

## 1. Stack y configuración

| Pieza | Versión / valor | Notas |
|---|---|---|
| Framework | **Next.js 16** (App Router) | `next dev -p 3001` |
| UI | **React 19** + TypeScript 5.7 (`strict: true`) | |
| Estilos | **Tailwind CSS 4** (vía `@tailwindcss/postcss`) + CSS propio con tokens `:root` | Convivencia híbrida: clases utilitarias + CSS por módulo |
| Estado | **Zustand 5** (un store por feature) | Sin Redux, sin Context para datos |
| Animación | **GSAP 3** + `@gsap/react`, **Lenis** (smooth scroll), **Swiper** | |
| Iconos | **lucide-react** | |
| Rutas tipadas | `typedRoutes: true` en `next.config.mjs` | Por eso hay `as Route` en algunas navegaciones |
| Imágenes remotas | `loremflickr.com`, `images.unsplash.com` | Whitelist en `next.config.mjs` |

**Alias de import** (`tsconfig.json`):

```
@/*        → src/*
@core/*    → src/core/*
@theme/*   → src/theme/*
@features/*→ src/features/*
@ui        → src/ui/index.ts   (barrel del design system)
@ui/*      → src/ui/*
```

**Variables de entorno** (`.env.local.example`):

```bash
NEXT_PUBLIC_USE_API=true                      # false → datasources mock (localStorage)
NEXT_PUBLIC_API_URL=http://localhost:8002/api # backend Laravel
NEXT_PUBLIC_SITE_URL=https://novacar.mx       # usado por sitemap.ts y robots.ts
```

`NEXT_PUBLIC_USE_API` es **el interruptor maestro**: se lee en cada `di.ts` y decide si
el módulo habla con Laravel o con el mock en `localStorage`.

---

## 2. Estructura de carpetas

```
frontend/src/
├── app/                  # App Router: solo rutas, metadata y composición
│   ├── layout.tsx        # Providers globales + fuentes + SiteChrome
│   ├── page.tsx          # Landing
│   ├── admin/            # Panel administrativo
│   ├── catalogo/[id]/    # Detalle de vehículo (Server Component)
│   ├── autopartes/[id]/  # Detalle de autoparte (Server Component)
│   ├── buscador/  importaciones/  ubicaciones/  cuenta/  login/  registro/
│   ├── error.tsx  not-found.tsx  loading.tsx
│   └── sitemap.ts  robots.ts
│
├── core/                 # Cross-cutting, sin dominio de negocio
│   ├── http/             # HttpClient (interfaz + FetchHttpClient) · createApiClient
│   ├── auth/             # AuthProvider · token · mockUsersStore · types
│   ├── i18n/             # I18nProvider · dictionaries (es/en, ~1.2k líneas)
│   ├── theme/            # ThemeProvider (light/dark, sin flash)
│   ├── toast/            # ToastProvider
│   ├── layout/           # SiteChrome (shell público vs shell admin)
│   ├── motion/           # SmoothScroll (Lenis) · PageTransition
│   ├── format/           # formatCurrency, normalizeText, prettifySlug…
│   └── result/           # Result<T,E> · tryAsync
│
├── theme/globals.css     # Design tokens :root + [data-theme="dark"] (2.5k líneas)
│
├── ui/                   # Design system (Atomic Design), agnóstico del dominio
│   ├── atoms/       Button, Badge, Input, Skeleton, ModalPortal, ScrollReveal…
│   ├── molecules/   StatCard, SearchInput, Pagination, ImageUrlField, SelectWithAdd…
│   ├── organisms/   Navbar, Footer, UserTopPanel, **DataTable**
│   ├── templates/   PageShell, HeroSplit, CollectionView, DetailLayout…
│   ├── hooks/       useModalA11y, useEditableOptions
│   └── index.ts     barrel
│
└── features/             # 6 módulos, cada uno con Clean Architecture completa
    ├── vehicles_catalog/       ← autos (landing, catálogo, detalle, importaciones, CRUD)
    ├── parts_marketplace/      ← autopartes / inventario
    ├── site_banners/           ← banners promocionales
    ├── quote_requests/         ← bandeja de cotizaciones y consultas
    ├── search_vehicle_parts/   ← buscador de compatibilidad por pasos
    └── admin_dashboard/        ← shell del panel + analytics (solo presentation)
```

---

## 3. Clean Architecture por feature

Cada módulo de `features/` repite la misma estructura de 3 capas + composition root:

```
features/<modulo>/
├── domain/                       ← PURO. No importa React, Next ni fetch.
│   ├── entities/                 Tipos del negocio (readonly) + reglas puras
│   ├── repositories/             INTERFACES (contratos), no implementaciones
│   └── usecases/                 Una clase por caso de uso, con .execute()
├── data/                         ← Traducción al mundo exterior
│   ├── models/                   DTO (forma exacta del JSON del backend, snake_case)
│   ├── mappers/                  DTO ⇄ Entity
│   ├── datasources/              HttpDataSource (real) + MockDataSource (localStorage)
│   └── repositories/             RepositoryImpl (implementa el contrato del domain)
├── presentation/                 ← React
│   ├── components/               Componentes del módulo
│   ├── pages/                    Pantallas completas
│   ├── store/                    Zustand (ViewModels)
│   ├── styles/                   CSS del módulo
│   └── *Presentation.ts          Helpers de mapeo dominio → iconos / claves i18n
├── di.ts                         ← COMPOSITION ROOT (el único que conoce lo concreto)
└── index.ts                      ← BARREL público del módulo
```

### Regla de dependencia

```
        presentation  ──────┐
             │              │  (importa use cases ya construidos desde di.ts)
             ▼              │
           di.ts  ──────────┘
          /     \
     data/       domain/
        \          ▲
         └─ implementa las interfaces de domain/repositories
```

- `domain/` no conoce a nadie.
- `data/` conoce a `domain/` (implementa sus contratos).
- `presentation/` conoce a `domain/` (tipos y use cases) — **nunca** a `data/`.
- `di.ts` es el único punto donde se instancian clases concretas.

### Regla de módulos

Un feature importa a otro **solo por su `index.ts`**, nunca por rutas internas:

```ts
// ✅ correcto
import { catalogUseCases, type CatalogVehicle } from "@features/vehicles_catalog";
// ❌ prohibido
import { CatalogRepositoryImpl } from "@features/vehicles_catalog/data/repositories/...";
```

### Composition root — el switch mock/API

Los cinco `di.ts` con datos siguen el mismo patrón:

```ts
const useHttp = process.env.NEXT_PUBLIC_USE_API === "true";
const dataSource = useHttp
  ? new CatalogHttpDataSource(createApiClient())
  : new CatalogMockDataSource();

const repository = new CatalogRepositoryImpl(dataSource);

export const catalogUseCases = {
  getFeaturedVehicles: new GetFeaturedVehiclesUseCase(repository),
  filterVehicles:      new FilterVehiclesUseCase(repository),
  getVehicleById:      new GetVehicleByIdUseCase(repository),
  createVehicle:       new CreateVehicleUseCase(repository),
  updateVehicle:       new UpdateVehicleUseCase(repository),
  deleteVehicle:       new DeleteVehicleUseCase(repository),
  getAllVehicles:      () => repository.getAll(),
} as const;
```

`site_banners` y `quote_requests` inyectan además el token: su datasource HTTP recibe
`() => createApiClient(getAuthToken())` como factory, para mandar `Authorization: Bearer`
en cada llamada (el token se lee en el momento de la petición, no al construir el módulo).

`search_vehicle_parts` es la excepción: **no tiene datasource ni repositorio**, solo use cases
puros que operan sobre los datos que le entregan los otros dos módulos.

---

## 4. Capa `core/` (cross-cutting)

| Módulo | Qué hace |
|---|---|
| `http/HttpClient.ts` | Interfaz `HttpClient` (get/post/put/patch/delete) + `FetchHttpClient` sobre `fetch`. Lanza `HttpError(status, message, payload)` en respuestas no-OK. La capa `data/` depende de la **interfaz**, nunca de `fetch`. |
| `http/createApiClient.ts` | Factory apuntando a `NEXT_PUBLIC_API_URL` (default `http://localhost:8000/api`). Acepta token opcional. |
| `auth/AuthProvider.tsx` | Sesión. Con API: `POST /auth/login`, `/auth/register`, `/auth/logout` (Sanctum). Sin API: `mockUsersStore` en localStorage. Persiste el usuario en `autodrive.session` y el token aparte. Expone `useAuth()`. |
| `auth/types.ts` | `UserRole = "admin" \| "operator" \| "customer"`. |
| `i18n/` | `I18nProvider` + `dictionaries.ts` (es/en). Expone `t(key, vars)` y `locale`. Persiste en `autodrive.locale`. **Todo texto de UI pasa por `t()`**. |
| `theme/` | Light/dark vía `data-theme` en `<html>`. Un script inline en `<head>` (`THEME_INIT_SCRIPT`) aplica el tema **antes del primer paint** para evitar el flash; por eso `<html suppressHydrationWarning>`. |
| `toast/` | `useToast().success/error/info`, auto-dismiss 4 s. Usado por todos los CRUD. |
| `layout/SiteChrome.tsx` | Decide el shell: si `pathname` empieza con `/admin` → `.admin-shell` sin Navbar/Footer; si no → Navbar + `<main class="container">` + Footer. |
| `motion/` | `SmoothScroll` (Lenis, sincronizado con GSAP ScrollTrigger) y `PageTransition`. |
| `format/formatters.ts` | `formatCurrency` (MXN, formato según locale), `normalizeText`, `formatStockLabel`, etc. |
| `result/Result.ts` | `Result<T,E>` + `tryAsync`. Disponible, pero hoy los stores usan `try/catch` directo. |

### Orden de providers (`app/layout.tsx`)

```
ThemeProvider
 └── I18nProvider
      └── AuthProvider
           └── ToastProvider
                ├── SmoothScroll
                ├── SkipLink            (a11y)
                └── SiteChrome → children
```

Fuentes: `Playfair_Display` + `Inter` (Google) + **Okomito Medium** local (`public/fonts/`),
expuestas como `--font-playfair`, `--font-inter`, `--font-okomito`.

---

## 5. Design system (`src/ui/`) y tokens

`globals.css` define **todo** por variables CSS en `:root` (tema claro) y las redefine bajo
`[data-theme="dark"]`. No hay colores hardcodeados en componentes.

Grupos de tokens: fondos (`--bg-base/surface/elevated/overlay`), marca (`--primary`,
`--primary-glow`, `--accent-neon`, `--gradient-brand*`), texto (`--text-primary/secondary/muted`),
semánticos (`--success/warning/danger` + `-soft`), bordes, radios (`--radius-sm/md/lg/pill/btn`),
sombras y glows, glass (`--glass-bg/border/blur`), navbar, transiciones (`--transition-smooth/fast`,
`--ease-spring`) y tipografía.

Atomic Design en `@ui`: **atoms** → **molecules** → **organisms** → **templates**, todo
exportado por `src/ui/index.ts`. Piezas que usan los formularios admin:

- `ImageUrlField` — dropzone de subida; **no hay backend de archivos**, así que lee el archivo
  con `FileReader` y guarda una **Data URL** en el campo `imageUrl`.
- `SelectWithAdd` + `useEditableOptions` — `<select>` al que el admin puede agregar opciones
  nuevas desde el propio formulario; se persisten en localStorage bajo claves como
  `novacar.options.vehicle.bodyType`.
- `ModalPortal` + `useModalA11y` — portal + foco atrapado + cierre con Escape.

---

## 6. Rutas (App Router)

| Ruta | Tipo | Renderiza | Módulo |
|---|---|---|---|
| `/` | Server | `HeroShowcase` → `VehicleFinderBar` → `CategoriesBento` → `BrandTicker` → `DiscountBanners` → `FeaturedVehicles` → `Testimonials` → `WhyChooseUs` | vehicles_catalog + parts_marketplace + site_banners |
| `/catalogo` | Server → Client | `CatalogExplorer` | vehicles_catalog |
| `/catalogo/[id]` | **Server async** | `getVehicleById.execute(id)` → `VehicleDetail`, o `notFound()` | vehicles_catalog |
| `/autopartes` | Server → Client | `PartsMarketplace` | parts_marketplace |
| `/autopartes/[id]` | **Server async** | `getPartById.execute(id)` → `PartDetail` | parts_marketplace |
| `/buscador` | Client | `StepWizard` (4 pasos) | search_vehicle_parts |
| `/importaciones` | Client | `ImportsPage` | vehicles_catalog |
| `/ubicaciones` | Client | Sucursales Cochabamba / Santa Cruz | — |
| `/login`, `/registro` | Client | Auth | core/auth |
| `/cuenta` | Client | Perfil del rol `customer` (staff es redirigido a `/admin`) | core/auth |
| `/admin` | Server + Suspense | `AdminDashboard` (pestaña por `?tab=`) | admin_dashboard |

Cada segmento pesado tiene su `loading.tsx` (`RouteLoading`), y hay `error.tsx` y
`not-found.tsx` globales con la identidad del sitio.

`sitemap.ts` genera `/sitemap.xml` incluyendo **una URL por vehículo y por autoparte reales**,
resolviéndolos con los mismos use cases.

---

## 7. Panel administrativo

### Shell y navegación

```
/admin  →  app/admin/page.tsx  (Suspense + Skeleton)
            └── AdminDashboard
                 ├── AdminTopbar        (barra superior fija, es su propio navbar)
                 └── <main class="admin-layout__main">
                       ├── AnalyticsPage             ?tab=analytics (default)
                       ├── VehiclesAdminPage         ?tab=vehicles
                       ├── InventoryPage             ?tab=inventory
                       ├── BannersPage               ?tab=banners
                       └── QuoteRequestsAdminPage    ?tab=quotes
```

- La pestaña activa vive **en la URL** (`?tab=`), no en estado local → recargar mantiene la vista.
- `SiteChrome` detecta `/admin` y no monta Navbar ni Footer del sitio público.
- `AdminTopbar` incluye marca, las 5 pestañas con icono, `LanguageSwitcher`, enlace de vuelta al
  sitio, avatar con iniciales, rol traducido y botón de logout.

### Guard de acceso

`AdminDashboard` protege el panel en el cliente:

```ts
const isStaff = user?.role === "admin" || user?.role === "operator";
if (!isAuthenticated) router.replace("/login");
else if (!isStaff)   router.replace("/");
```

Un `customer` puede loguearse en el sitio pero no entra al panel. Mientras redirige se muestra
un `.admin-guard` con mensaje y CTA. **Es una protección de UI, no de servidor**: la seguridad
real la debe imponer el backend en los endpoints `/admin/*`.

Credencial demo del mock: `admin@novacar.com` / `demo` (rol `admin`), sembrada en
`novacar.users`.

### AnalyticsPage

No inventa cifras: monta los tres stores (`useVehicleAdminStore`, `useMarketplacePartAdminStore`,
`useBannerStore`), los carga en paralelo y calcula con `useMemo`:

| KPI | Fórmula |
|---|---|
| Autos | `vehicles.length` (+ cuántos `highlighted`) |
| Piezas | `parts.length` (+ cuántas con `freeShipping`) |
| Alertas | `parts.filter(isLowStock).length` (top 5 por déficit `stock - reorderLevel`) |
| Valor de inventario | `Σ stock × finalPrice(part)` |
| Banners | `activos / total` |
| Composición del catálogo | `DonutChart` [autos, piezas] |
| Piezas por categoría | `BarChart`, top 6 |

`DonutChart` y `BarChart` son SVG propios del feature — sin librería de gráficas.

---

## 8. Las tablas — `DataTable` y sus cuatro instancias

### 8.1 El organismo genérico

`src/ui/organisms/DataTable.tsx` (117 líneas) es **la única tabla del proyecto**. Vive en `@ui`,
no en un feature, porque cuatro módulos la comparten.

```ts
export interface Column<T> {
  key: string;                      // key de React + identificador de la columna
  header: string;                   // texto ya traducido con t()
  render: (row: T) => ReactNode;    // render libre: JSX, badges, botones, inputs
  align?: "left" | "right";         // default "left"
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  pageSize?: number;                // default 8 (hoy ninguna página lo sobreescribe)
}
```

Características y decisiones:

- **Genérica por tipo** (`DataTable<T>`): no sabe nada de vehículos, piezas ni banners.
  Toda la lógica de dominio vive en la función `render` de cada columna.
- **Paginación interna** por `slice`: `pageCount = ceil(rows.length / pageSize)`, y los
  controles (`.admin-pagination`) solo se renderizan si `pageCount > 1`. El texto es
  `t("admin.paginationInfo", { page, total })`.
- **Auto-reset de página**: un `useEffect` con dependencia `[rows.length]` vuelve a la página 1
  cuando cambia el tamaño del dataset (búsqueda, filtro, alta o baja).
- **`safePage`**: si la página actual queda fuera de rango se clampea con
  `Math.min(page, pageCount)` — no rompe aunque el efecto no haya corrido.
- **Estilos**: contenedor `.card` con `overflow: hidden`; celdas con `padding: 14px 18px`,
  encabezados en mayúsculas con `--text-muted`, separadores `1px solid var(--border)`.
  El hover de fila, `.admin-thumb`, `.admin-iconBtn`, `.admin-row-actions` y `.admin-toggle`
  viven en `globals.css`.
- **Sin ordenamiento ni selección múltiple**: el filtrado y el orden se resuelven *antes*,
  en la página que la usa (con `useMemo` o `.sort()`), y se le pasan las filas ya listas.

**Filas vacías**: `DataTable` nunca renderiza un empty state — cada página comprueba
`filtered.length === 0` y muestra su propio mensaje (`admin.vehiclesEmpty`, etc.) en lugar de
la tabla.

### 8.2 Anatomía común de las cuatro páginas de tabla

Las cuatro siguen el mismo guion:

```
1. useEffect(() => { void load(); }, [load])        → carga vía store
2. if (loading && rows.length === 0) → <Skeleton height={320} />
3. useMemo → filtrado local (búsqueda o filtro por tipo)
4. const columns: Column<T>[] = [...]               → definidas dentro del componente
                                                      para poder usar t() y locale
5. header (título + subtítulo + botón "+ Nuevo")
6. buscador / subtabs
7. filtered.length === 0 ? <mensaje vacío> : <DataTable ... />
8. {modal && <FormModal … onSubmit={handleSubmit} />}
```

Y el mismo contrato de acciones:

- Editar → `setModal(row)` → el modal precarga los campos de esa fila.
- Crear → `setModal("new")` → el modal arranca vacío.
- `handleSubmit` decide: `modal === "new" ? create(input) : update(row.id, input)`.
- Eliminar → `window.confirm(t("...DeleteConfirm"))` → `remove(id)` → `toast.success(...)`.
- Éxito de guardado → toast + `onClose()`; error → mensaje inline `t("common.saveError")`.

El estado del modal es siempre del mismo tipo: `T | "new" | null`.

### 8.3 Tabla de Vehículos — `VehiclesAdminPage`

| Columna | `key` | Contenido | Align |
|---|---|---|---|
| Modelo | `vehicle` | `.admin-thumb` (imagen) + `<strong>{brand} {model}</strong>` + año en muted | left |
| Carrocería | `bodyType` | `t("body." + v.bodyType)` | left |
| Precio | `price` | `formatCurrency(v.price, locale)` | **right** |
| Destacado | `highlighted` | `<Badge tone="neon">` con estrella, o `—` | left |
| — | `actions` | Botones editar (`Pencil`) y eliminar (`Trash2`) | **right** |

- Búsqueda local: `useMemo` sobre `` `${brand} ${model}` `` en minúsculas (`.admin-search`).
- La miniatura usa `vehiclePhotoUrl(id, brand, bodyType, {w:128,h:84}, imageUrl)` y en `onError`
  se oculta con `visibility: hidden` (no rompe el layout de la fila).
- Modal: `VehicleFormModal`, controlado por el estado local `modalVehicle`.

### 8.4 Tabla de Inventario / Autopartes — `MarketplacePartsAdminPage`

Unifica lo que antes eran dos sub-pestañas ("Piezas" y "Autopartes") sobre un modelo único,
`MarketplacePart`.

| Columna | `key` | Contenido | Align |
|---|---|---|---|
| Producto | `part` | miniatura + nombre + `SKU · marca` | left |
| Tipo | `category` | `resolveCategoryLabel(p.category, t)` | left |
| Precio | `price` | `formatCurrency(p.price, locale)` | **right** |
| Stock | `stock` | `<Badge tone={stock<=0 ? "out" : stock<=5 ? "low" : "in"}>` | **right** |
| — | `actions` | editar / eliminar | **right** |

- Búsqueda local por **nombre, SKU o marca**.
- Peculiaridad de composición: el **modal es controlado por el padre** (`InventoryPage`), que le
  pasa `modalPart / onOpenEdit / onCloseModal` como props, para que el botón "+ Nueva autoparte"
  pueda vivir en el header de `InventoryPage`, a la altura del título.
- Ojo: la columna Stock usa el umbral fijo `5`, mientras que las alertas de Analytics usan
  `isLowStock` (`stock <= reorderLevel`). Son dos criterios distintos.

### 8.5 Tabla de Banners — `BannersPage`

| Columna | `key` | Contenido |
|---|---|---|
| Banner | `banner` | `<img src={b.imageUrl}>` + título + `href` en muted |
| Estado | `status` | `<input type="checkbox">` **en línea** → `toggleActive(id, checked)` |
| Orden | `order` | Flechas ↑/↓ → `moveUp(id)` / `moveDown(id)`; deshabilitadas en los extremos |
| — | `actions` | editar / eliminar |

Aquí la tabla no es solo lectura: **muta el dato desde la celda**. Las filas se ordenan antes de
pasarlas (`[...banners].sort((a,b) => a.order - b.order)`), y el índice para deshabilitar las
flechas se calcula sobre ese arreglo `ordered`. `moveUp`/`moveDown` intercambian posiciones y
llaman a `reorderBanners.execute(ids)`, que devuelve la lista ya reordenada.

### 8.6 Tabla de Cotizaciones — `QuoteRequestsAdminPage`

| Columna | `key` | Contenido |
|---|---|---|
| Origen | `source` | Icono según `source` (`Car` / `MessageSquareText` / `CalendarCheck`) + etiqueta |
| Asunto | `subject` | asunto + email del cliente en muted |
| Detalle | `details` | `formatCurrency(amount)` si existe + texto libre |
| Fecha | `createdAt` | `toLocaleString` con locale es-MX / en-US |
| Estado | `status` | `<Badge>` que envuelve un `<select>` transparente → `updateStatus(id, status)` |
| — | `actions` | eliminar (no hay edición) |

- Filtro por **subtabs** (`.admin-subtabs`): todas / importación / consulta / prueba de manejo.
- Tono del badge por estado: `new → neon`, `contacted → low`, `closed → in`.

### 8.7 Paginación fuera del admin

El catálogo público **no** usa `DataTable`: `CatalogExplorer` tiene su propia paginación con la
molécula `Pagination` (numerada, con elipsis para rangos largos), `PAGE_SIZE = 8`, y hace scroll
suave al inicio del listado al cambiar de página. Son dos sistemas deliberadamente distintos:
tabla densa en el admin, grid/lista en el sitio.

---

## 9. Módulo de vehículos (`vehicles_catalog`) a fondo

Es el módulo más grande: ~3.500 líneas solo en `presentation/`.

### 9.1 Entidad `CatalogVehicle`

Todos los campos son `readonly`. Uniones cerradas para los enumerados:

```ts
type BodyType     = "sedan" | "suv" | "hatchback" | "pickup" | "motocicleta";
type FuelType     = "gasolina" | "hibrido" | "electrico" | "diesel";
type Transmission = "manual" | "automatica";
type Condition    = "nuevo" | "seminuevo";
```

| Bloque | Campos |
|---|---|
| Identidad | `id`, `brand`, `model`, `year`, `price`, `tagline` |
| Clasificación | `bodyType`, `fuelType`, `transmission`, `condition` |
| Specs | `mileageKm` (0 = nuevo), `horsepower`, `seats`, `doors`, `cylinders`, `displacement`, `driveType`, `color` |
| Marketing | `features[]`, `highlights[]`, `highlighted` (destacado en el home), `imageUrl?`, `accentFrom`, `accentTo` |
| Subasta / venta | `titleCode`, `saleDate`, `saleTime`, `saleLocation`, `hasKeys`, `runAndDrive` |
| Estado físico | `damageType`, `damageSeverity` (`none\|minor\|moderate\|severe`), `damageDescription`, `notes` |

Tipos derivados:

- `NewCatalogVehicle = Omit<CatalogVehicle, "id">` — lo que captura el formulario del admin.
- `CatalogFilterOptions` — `{ brands, bodyTypes, fuelTypes, priceRange:{min,max} }`, derivado del dataset.
- `VehicleFilters` — `{ brand?, bodyType?, fuelType?, maxPrice?, search? }`, todos opcionales.

### 9.2 DTO ⇄ Entidad

El backend habla **snake_case**, el dominio **camelCase**. `vehicleMapper.ts` traduce en ambas
direcciones (33 campos):

```
CatalogVehicleDTO            CatalogVehicle
─────────────────            ──────────────
body_type          ──────►   bodyType
mileage_km         ──────►   mileageKm
image_url          ──────►   imageUrl
accent_from/to     ──────►   accentFrom / accentTo
damage_severity    ──────►   damageSeverity
run_and_drive      ──────►   runAndDrive
…
```

- `toCatalogVehicle(dto)` / `toCatalogVehicles(dtos)` — entrada.
- `toCatalogVehiclePayload(input)` — salida (sin `id`; lo asigna el backend o el mock).

Los enumerados se castean (`dto.body_type as BodyType`): **no hay validación en runtime**, así que
un valor inesperado del backend entra al dominio sin protestar.

### 9.3 Datasources

`CatalogRemoteDataSource` es la interfaz; hay dos implementaciones.

**`CatalogHttpDataSource`** (activa con `NEXT_PUBLIC_USE_API=true`):

| Método | Verbo y ruta |
|---|---|
| `fetchAll` | `GET /catalog/vehicles` |
| `fetchById` | `GET /catalog/vehicles/{id}` (`.catch(() => null)`) |
| `create` | `POST /admin/catalog/vehicles` |
| `update` | `PUT /admin/catalog/vehicles/{id}` |
| `remove` | `DELETE /admin/catalog/vehicles/{id}` |

**`CatalogMockDataSource`** — persiste en `localStorage` bajo `novacar.catalogVehicles`:

- `readStore()`: si no hay nada guardado, escribe el `SEED` y lo devuelve. Incluye una
  **migración puntual** que reasigna `image_url` al Nissan Versa si le falta.
- `writeStore()`: reemplaza el arreglo completo.
- `delay(value, 220)`: simula latencia de red para que los skeletons se vean de verdad.
- `create`: genera el `id` como **slug** de `marca-modelo-año` (normalizado, sin acentos) y le
  añade `-{timestamp}` si ya existe. Inserta al **principio** del arreglo.
- `update`: rechaza con `Error("Vehículo no encontrado.")` si el id no existe.

**SEED (6 vehículos):**

| id | Marca / modelo | Año | Precio | Carrocería | Destacado |
|---|---|---|---|---|---|
| `nissan-versa-2021` | Nissan Versa Sense | 2021 | 289 000 | sedan | ✔ |
| `vw-jetta-2022` | Volkswagen Jetta Trendline | 2022 | 410 000 | sedan | ✔ |
| `toyota-corolla-2023` | Toyota Corolla Hybrid | 2023 | 445 000 | sedan | ✔ |
| `tesla-model3-2023` | Tesla Model 3 | 2023 | 985 000 | sedan | ✔ |
| `bmw-e46-m3-2004` | BMW E46 M3 | 2004 | 620 000 | sedan | ✔ |
| `bmw-f650gs-2023` | BMW F650GS | 2023 | 248 000 | motocicleta | ✘ |

Son 5 destacados, pero el home muestra como máximo 4 (ver `getFeatured` abajo).

### 9.4 Repositorio y use cases

`CatalogRepositoryImpl` es una capa fina: llama al datasource y mapea. Con una excepción con
lógica propia — `getFeatured()` **no** pega a un endpoint especial, sino que trae todo y filtra:

```ts
async getFeatured() {
  const all = await this.getAll();
  return all.filter(v => v.highlighted).slice(0, 4);   // máximo 4 en el home
}
```

| Use case | Qué encapsula |
|---|---|
| `GetFeaturedVehiclesUseCase` | Delegación directa a `getFeatured()`. |
| `FilterVehiclesUseCase` | **La lógica de negocio real.** `execute(filters)` filtra en memoria por marca / carrocería / combustible / precio máximo / búsqueda (normalizando acentos con NFD). `getOptions()` deriva marcas únicas ordenadas, carrocerías, combustibles y el rango de precios min/max. |
| `GetVehicleByIdUseCase` | Delegación. |
| `CreateVehicleUseCase` | **Valida antes de persistir**: marca y modelo no vacíos, `price > 0`, `year` entre 1980 y el año que viene. Lanza `Error` con mensaje en español. |
| `UpdateVehicleUseCase` / `DeleteVehicleUseCase` | Delegación. |

Nota: el filtrado ocurre **en el cliente** sobre el dataset completo. Funciona con 6 vehículos;
con cientos habría que mover los filtros a query params del backend (el contrato de `HttpClient`
ya soporta `params`).

### 9.5 Los dos stores de vehículos

Separados a propósito — lectura pública vs. gestión administrativa:

**`useCatalogStore`** (explorador público):

| Acción | Efecto |
|---|---|
| `init(preset?)` | Carga `getOptions()` + `execute(filters)` **en paralelo** (`Promise.all`). El `preset` (filtros leídos de la URL) gana sobre el estado previo. |
| `setFilter(key, value)` | **Toggle**: reseleccionar el mismo valor lo limpia (`=== value ? undefined : value`). Refetch. |
| `setFilters(partial)` | Fusiona varios filtros con **un solo fetch** — lo usa el buscador rápido del home. |
| `clearFilters()` | Vacía filtros y recarga. |

**`useVehicleAdminStore`** (CRUD del panel):

```
vehicles[] · loading · error
load()   → getAllVehicles()                   → reemplaza la lista
create() → createVehicle.execute(input)       → prepend optimista: [created, ...vehicles]
update() → updateVehicle.execute(id, input)   → map por id
remove() → deleteVehicle.execute(id)          → filter por id
```

`create` y `update` devuelven `boolean` (no lanzan): el modal usa ese booleano para decidir entre
toast de éxito o mensaje de error inline. Los errores quedan en `error` del store.

### 9.6 Flujo completo de un alta de vehículo

```
[Admin] "+ Añadir auto"
   → setModalVehicle("new")
   → VehicleFormModal (ModalPortal + useModalA11y)
   → submit → handleSubmit → create(input)
   → useVehicleAdminStore.create
   → catalogUseCases.createVehicle.execute(input)        ← VALIDA aquí
   → CatalogRepositoryImpl.createVehicle
   → toCatalogVehiclePayload(input)   (camelCase → snake_case)
   → DataSource: POST /admin/catalog/vehicles   |   mock: slug + writeStore(localStorage)
   → toCatalogVehicle(dto)            (snake_case → camelCase)
   → store: vehicles = [created, ...vehicles]
   → DataTable re-renderiza (su useEffect sobre rows.length vuelve a página 1)
   → toast.success + onClose()
```

### 9.7 `VehicleFormModal` — qué captura y qué no

Captura: imagen (`ImageUrlField`), marca, modelo, año, tagline, precio, kilometraje, potencia,
carrocería, combustible, transmisión (los tres con `SelectWithAdd`), condición, asientos,
destacado (checkbox), features (texto separado por comas → `split(",").map(trim).filter(Boolean)`)
y los dos colores de acento (`<input type="color">`).

**No captura** los ~16 campos extendidos (`color`, `doors`, `cylinders`, `displacement`,
`driveType`, `titleCode`, `saleDate`, `saleTime`, `saleLocation`, `hasKeys`, `damageType`,
`damageSeverity`, `damageDescription`, `notes`, `runAndDrive`, `highlights`). Al enviar se
rellenan con `vehicle?.<campo> ?? <default>`:

- **Editando** → se preservan los valores existentes del vehículo.
- **Creando** → quedan en placeholders (`"No especificado"`, `"Sin daños reportados"`,
  `doors: 4`, `cylinders: 4`, `saleDate` = hoy, `highlights: []`).

Consecuencia visible: un auto creado desde el panel muestra la ficha extendida del detalle
poblada con "No especificado".

### 9.8 Vehículos en el sitio público

| Pantalla | Cómo obtiene los datos |
|---|---|
| **Home · `FeaturedVehicles`** | `catalogUseCases.getFeaturedVehicles.execute()` en `useEffect`. Layout split 50/50, PNG recortado `public/vehicles/{Marca}.png`, animación GSAP, `CountUp` en specs numéricos. |
| **Home · `VehicleFinderBar`** | `filterVehicles.getOptions()` para poblar marca/carrocería; los tramos de presupuesto se calculan sobre `priceRange` (35 %, 65 %, 100 %, redondeados a 50 000). Al enviar: `setFilters({...})` en el **store compartido** y `router.push("/catalogo")` — el explorador ya encuentra los filtros aplicados. |
| **`/catalogo` · `CatalogExplorer`** | Lee filtros de la URL (`brand`, `body`, `fuel`, `maxPrice`, `q`) → `init(preset)`. Sincroniza al revés con `router.replace` cada vez que cambian los filtros (URL compartible). Dos vistas: `horizontal` (`VehicleShowcaseSlide`) y `grid` (`VehicleGridCard`). Skeletons mientras `loading`, empty state con botón de limpiar filtros. |
| **`/catalogo/[id]` · `VehicleDetail`** | **Server Component**: `await catalogUseCases.getVehicleById.execute(id)`, `notFound()` si es null. Galería con lightbox (5 encuadres sobre la misma foto), tarjeta de precio, specs agrupados (motor / carrocería / rendimiento), bloque de daños con badge por severidad, CTA de prueba de manejo. |
| **`/importaciones` · `ImportsPage`** | `filterVehicles.execute({})` → todos. Mismas dos vistas. CTA "Cotizar importación" abre `ImportQuoteModal` (cálculo de ejemplo: 16 % de impuesto + 25 000 de flete). |
| **`/buscador` · `StepWizard`** | Ver §10. |

### 9.9 Resolución de imágenes de vehículo — **hay dos sistemas**

Este es un punto de confusión real del código actual:

| Resolver | Archivo | Cascada | Quién lo usa |
|---|---|---|---|
| `vehiclePhotoUrl(id, brand, bodyType, size, imageUrl)` | `vehiclePresentation.ts` | 1) `imageUrl` del admin → 2) `VEHICLE_PHOTO_OVERRIDES` (`/vehicles/Nissan.jpg`, `/vehicles/BMW.jpg`…) → 3) `loremflickr.com` con semilla estable por id | Tabla admin, `FeaturedVehicles`, `ImportVehicleCard`, modales de cotización y prueba de manejo |
| `getVehicleImageUrl(vehicle)` | `catalogPresentation.ts` | 1) `imageUrl` → 2) `VEHICLE_IMAGES` (URLs de Unsplash por id) → 3) mapa por marca → 4) foto genérica de Unsplash | `VehicleGridCard`, `VehicleShowcaseSlide`, `VehicleDetail` |

Es decir: **el mismo auto puede verse con una foto en la tabla del admin y con otra en el
catálogo público**. Unificar en un solo resolver es deuda técnica pendiente.

---

## 10. Cómo se conectan los demás módulos con los vehículos

### `search_vehicle_parts` — el buscador por pasos

No tiene datasource ni repositorio propios: **consume los otros dos módulos** por sus barrels.

```
init() → Promise.all([ catalogUseCases.getAllVehicles(),
                       marketplaceUseCases.getAllParts() ])

paso 0  marca      ← DeriveVehicleOptions.getBrands(vehicles)
paso 1  modelo     ← getModels(vehicles, brand)
paso 2  año        ← getYears(vehicles, brand, model)   (descendente)
paso 3  categoría  → GetCompatibleParts.execute({ parts, vehicle, category })
```

Regla de compatibilidad (`GetCompatiblePartsUseCase`):

- Marca: `compatibleBrands` vacío (pieza universal) **o** contiene la marca del vehículo.
- Año: `yearFrom <= year <= yearTo`.
- El **modelo no participa** del filtro: el admin solo registra compatibilidad por marca + rango
  de años.
- Orden del resultado: primero las que tienen stock, luego por precio ascendente.

Esto significa que **lo que el admin publica en Vehículos alimenta directamente las opciones del
buscador**: si no hay ningún BMW en el catálogo, "BMW" no aparece como marca.

### `quote_requests` — la bandeja compartida

Tres formularios públicos escriben en la misma bandeja:

| Origen (`source`) | Componente | Ruta |
|---|---|---|
| `import` | `ImportQuoteModal` | `/importaciones` |
| `test_drive` | `TestDriveModal` | `/catalogo/[id]` |
| `inquiry` | `ProductInquiryModal` | `/autopartes/[id]` |

Todos llaman a `useQuoteRequestStore().create(...)`, y el admin las gestiona en `?tab=quotes`.
Nota: `create` **no** actualiza `requests` en el store (el visitante público no necesita la
lista); el admin las ve al hacer `load()`.

### `site_banners` — home ⇄ admin

`DiscountBanners` (home) llama a `loadActive()` → `GET /banners` o el mock; si no hay banners
activos **no renderiza nada**. El admin gestiona los mismos registros con `loadAll()` →
`GET /admin/banners`. Ambos comparten `useBannerStore`, así que conviven en el mismo estado
global (el contenido depende de cuál de las dos acciones se llamó por última vez).

---

## 11. Estado global — mapa de stores

| Store | Módulo | Consumido por |
|---|---|---|
| `useCatalogStore` | vehicles_catalog | `CatalogExplorer`, `VehicleFinderBar` |
| `useVehicleAdminStore` | vehicles_catalog | `VehiclesAdminPage`, `AnalyticsPage` |
| `usePartsMarketplaceStore` | parts_marketplace | `PartsMarketplace` (facetas, orden, 10+ filtros) |
| `useMarketplacePartAdminStore` | parts_marketplace | `MarketplacePartsAdminPage`, `AnalyticsPage` |
| `useBannerStore` | site_banners | `BannersPage`, `DiscountBanners` |
| `useQuoteRequestStore` | quote_requests | `QuoteRequestsAdminPage`, `ImportQuoteModal`, `TestDriveModal`, `ProductInquiryModal` |
| `useSearchWizardState` | search_vehicle_parts | `StepWizard` |

Patrón común: `{ data[], loading, error, load(), create(), update(), remove() }`, con
actualización optimista local tras cada mutación (no se recarga la lista completa).

Los stores son **singletons de módulo** creados con `create()` de Zustand. Como los `di.ts`
también se evalúan al importar, los use cases se instancian una sola vez por proceso.

---

## 12. Persistencia en el navegador

| Clave de `localStorage` | Contenido |
|---|---|
| `novacar.catalogVehicles` | Vehículos del mock (CRUD del admin) |
| `novacar.marketplaceParts` | Autopartes del mock |
| `novacar.banners` | Banners del mock |
| `novacar.quote_requests` | Cotizaciones del mock |
| `novacar.users` | Usuarios del mock (incluye contraseñas en claro — solo mock) |
| `novacar.options.vehicle.*` | Opciones extra agregadas desde `SelectWithAdd` |
| `autodrive.session` | Usuario autenticado |
| `autodrive.locale` | Idioma (`es` / `en`) |
| `autodrive.theme` | Tema (`light` / `dark`) |

⚠️ `ImageUrlField` guarda las imágenes como **Data URL** dentro del registro. En modo mock eso
va a `localStorage`, cuyo límite ronda los 5 MB: subir un par de fotos grandes puede llenar la
cuota y hacer fallar los `writeStore`.

---

## 13. Estado real de la integración con el backend

`NEXT_PUBLIC_USE_API=true` en el ejemplo de entorno, pero el backend Laravel
(`backend/routes/api.php`) **solo expone hoy**:

```
POST   /auth/login          GET /auth/me          POST /auth/logout
GET    /vehicles/brands|models|years    GET /parts/compatible
GET    /catalog/vehicles    GET /catalog/vehicles/{id}
GET    /marketplace/parts   GET /marketplace/parts/{id}
GET    /admin/inventory     POST /admin/inventory
GET    /admin/analytics     PATCH /admin/inventory/{id}/stock
```

Rutas que el frontend ya invoca y **que aún no existen en el backend**:

| Frontend llama | Estado |
|---|---|
| `POST/PUT/DELETE /admin/catalog/vehicles[/{id}]` | ❌ no implementado |
| `POST/PUT/DELETE /admin/marketplace/parts[/{id}]` | ❌ no implementado |
| `GET/POST/PUT/DELETE /admin/banners`, `GET /banners` | ❌ no implementado |
| `GET /admin/quote-requests`, `POST /quote-requests`, `PATCH .../status` | ❌ no implementado |
| `POST /auth/register` | ❌ no implementado |

**Conclusión práctica:** con `NEXT_PUBLIC_USE_API=true` la lectura del catálogo y del marketplace
funciona, pero **todo el CRUD del panel falla** (404 → `HttpError` → `error` en el store → toast
o mensaje de guardado fallido). Para demos, `NEXT_PUBLIC_USE_API=false` deja todo operativo
contra `localStorage`.

---

## 14. Puntos frágiles conocidos

1. **Detalle de un vehículo creado por el admin → 404.** `/catalogo/[id]` es un Server Component;
   en el servidor `readStore()` de `CatalogMockDataSource` devuelve `SEED` porque
   `typeof window === "undefined"`. Un auto creado en modo mock existe en `localStorage` pero su
   página de detalle responde `notFound()`. Mismo caso en `/autopartes/[id]` y en `sitemap.ts`.
2. **Dos resolvers de imagen** con overrides distintos (§9.9): la foto del admin y la del catálogo
   pueden no coincidir.
3. **`VehicleFormModal` no cubre los campos extendidos** (§9.7): los autos nuevos nacen con
   "No especificado" en la ficha del detalle.
4. **`DataTable` resetea página con `[rows.length]`**: si el contenido cambia pero el número de
   filas es el mismo, la página no se reinicia (el `safePage` evita el crash, no el desconcierto).
5. **Dos criterios de stock bajo**: la tabla de inventario usa `stock <= 5`; Analytics usa
   `stock <= reorderLevel`.
6. **Sin validación en runtime de los DTO**: los enumerados se castean a ciegas
   (`dto.body_type as BodyType`).
7. **El guard de `/admin` es solo de cliente**: la autorización real depende del backend.
8. **Filtros y búsqueda en memoria**: `FilterVehiclesUseCase` y `SearchPartsUseCase` traen todo el
   dataset y filtran en el navegador; no escala más allá de decenas de registros.
9. **`Result<T,E>` existe pero no se usa**: los stores manejan errores con `try/catch` y
   `boolean`, no con el tipo discriminado que ofrece `core/result`.
10. **`VehiclePartsModal` usa datos mock locales**, no la compatibilidad real por vehículo (está
    anotado en el propio archivo).

---

## 15. Cómo agregar un módulo nuevo (receta)

```
1. features/<nuevo>/domain/entities/<Entity>.ts             → tipo readonly + NewEntity
2. features/<nuevo>/domain/repositories/<X>Repository.ts    → la interfaz
3. features/<nuevo>/domain/usecases/*.ts                    → una clase por caso de uso, con validación
4. features/<nuevo>/data/models/<X>DTO.ts                   → snake_case, espejo del backend
5. features/<nuevo>/data/mappers/<x>Mapper.ts               → to<Entity> + to<Entity>Payload
6. features/<nuevo>/data/datasources/<X>RemoteDataSource.ts → interfaz + Http + Mock(localStorage)
7. features/<nuevo>/data/repositories/<X>RepositoryImpl.ts
8. features/<nuevo>/di.ts                                   → switch NEXT_PUBLIC_USE_API + export useCases
9. features/<nuevo>/presentation/store/use<X>Store.ts       → Zustand con load/create/update/remove
10. features/<nuevo>/presentation/pages/<X>AdminPage.tsx    → columns: Column<T>[] + <DataTable />
11. features/<nuevo>/index.ts                               → barrel público
12. Registrar la pestaña en AdminTopbar (AdminPage) y en AdminDashboard (TABS + render)
13. Agregar las claves de texto en core/i18n/dictionaries.ts (es + en)
```

Para conectar un módulo al backend real basta con que el endpoint exista: el `di.ts` ya lo
selecciona solo con la variable de entorno.
