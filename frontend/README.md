# AutoDrive 🚗⚡

Plataforma de venta de **autos y autopartes** (baterías y fusibles) con un **buscador
inteligente de compatibilidad** paso a paso. Construida con **Next.js (App Router) +
TypeScript**, siguiendo **Clean Architecture** combinada con **arquitectura modular
(Feature-Driven Development)**.

## 🚀 Puesta en marcha

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

- `/` — Landing y catálogo (módulo `vehicles_catalog`)
- `/buscador` — Buscador paso a paso (módulo `search_vehicle_parts`)
- `/admin` — Panel administrativo (módulo `admin_dashboard`)

> Los módulos funcionan con **datasources mock in-memory**, así que la app corre sin
> backend. Cambiar a una API REST real es una sola línea en cada `di.ts`.

## 🧅 Capas de Clean Architecture (por módulo)

Regla de dependencia: **la capa interna no conoce a la externa**.

```
domain/        ← Entidades + Use Cases + interfaces de repositorio (puro, sin frameworks)
   ↑ implementa
data/          ← DTOs + Mappers + DataSources + RepositoryImpl
   ↑ consume (vía di.ts)
presentation/  ← Componentes UI + State (Zustand) que invocan los Use Cases
```

El ensamblaje ocurre en el **composition root** `di.ts` de cada módulo: es el único
lugar que conoce implementaciones concretas. La UI sólo importa Use Cases ya construidos.

## 🗂️ Estructura

```
src/
├── core/            # Cross-cutting: HttpClient, formatters, Result
├── theme/           # globals.css con el sistema de diseño :root (oscuro + cobalto + cyan)
└── features/
      ├── search_vehicle_parts/   # Buscador por pasos  ← caso de uso destacado
      ├── admin_dashboard/        # Panel administrativo
      └── vehicles_catalog/       # Landing + catálogo
```

Cada feature contiene `domain/`, `data/`, `presentation/` y su `di.ts`.

## 🎨 Sistema de diseño

Definido en [`src/theme/globals.css`](src/theme/globals.css) con variables `:root`:
esquema oscuro, azul cobalto (`--primary-glow`), cyan neón (`--accent-neon`), radios
(`--radius-lg`) y transiciones (`--transition-smooth`). Todos los componentes consumen
estas variables — no hay colores hardcodeados.

## 🔌 Conectar una API real

En `src/features/<modulo>/di.ts`, reemplaza el datasource mock:

```ts
import { FetchHttpClient } from "@core/http/HttpClient";
import { SearchHttpDataSource } from "./data/datasources/SearchRemoteDataSource";

const http = new FetchHttpClient(process.env.NEXT_PUBLIC_API_URL!);
const dataSource = new SearchHttpDataSource(http); // ← antes: new SearchMockDataSource()
```

El resto de las capas no cambia: ese es el objetivo del desacoplamiento.
```
