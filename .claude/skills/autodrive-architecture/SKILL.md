---
name: autodrive-architecture
description: Arquitectura de AutoDrive (Clean Architecture + Feature-Driven) para frontend Next.js y el backend/API que lo alimenta. Úsalo SIEMPRE que crees o modifiques un módulo (feature), añadas un caso de uso, un repositorio, un datasource, definas un endpoint del backend, o decidas dónde colocar un archivo. Cubre la regla de dependencia, el composition root (di.ts), el contrato de la API REST y cómo migrar de mock a HTTP/FastAPI sin tocar la UI.
---

# Arquitectura AutoDrive

Plataforma de venta de **autos y autopartes** (baterías y fusibles). Stack: **Next.js (App Router) + TypeScript**, estado con **Zustand**, backend objetivo **FastAPI** (ver skill `fastapi-structure`).

## Principio rector

**Clean Architecture + Arquitectura Modular.** La regla innegociable:

> La capa interna NO conoce a la externa. `domain` ⇏ `data` ⇏ `presentation`.

El flujo de dependencias apunta siempre hacia el dominio (inversión de dependencias vía interfaces).

## Estructura por feature

Cada módulo en `src/features/<feature>/` tiene exactamente 3 capas + composition root:

```
<feature>/
├── domain/
│   ├── entities/        # Modelos puros (sin imports de React, Next, fetch, zustand)
│   ├── repositories/    # Interfaces (contratos). Definen QUÉ, no CÓMO.
│   └── usecases/        # Lógica de negocio. Reciben repos por constructor.
├── data/
│   ├── models/          # DTOs (forma cruda de la API). Nunca salen de /data.
│   ├── mappers/         # Funciones puras DTO -> Entity.
│   ├── datasources/     # Origen real: HTTP (FetchHttpClient) + Mock in-memory.
│   └── repositories/    # *Impl que implementan las interfaces de domain.
├── presentation/
│   ├── components/       # UI ("use client" solo aquí). Tontos cuando se pueda.
│   ├── hooks/ | store/   # Zustand: ViewModel. Invoca use cases, no fetch.
│   ├── pages/            # Composiciones de página del feature.
│   └── styles/           # CSS que consume SOLO variables :root.
└── di.ts                 # Composition Root: ensambla datasource -> repo -> usecases.
```

## Reglas duras (no romper)

1. **`domain/` es puro.** Prohibido importar `react`, `next`, `zustand`, `fetch`, axios o cualquier DTO. Solo TypeScript y otras entidades/contratos del dominio.
2. **La presentación nunca ve un DTO.** Si un componente importa algo de `data/models`, está mal. Los mappers traducen en `data/`.
3. **Los use cases reciben dependencias por constructor** (interfaz del repo), nunca instancian datasources.
4. **`di.ts` es el único lugar** que conoce implementaciones concretas (`SearchMockDataSource`, `SearchHttpDataSource`). Cambiar de mock a producción = 1 línea ahí.
5. **`"use client"`** solo en `presentation/`. Server Components pueden invocar use cases directamente (ver `FeaturedVehicles.tsx`).
6. Un feature **no importa de la capa interna de otro feature**. Lo compartido vive en `src/core/`.

## Patrón Use Case

```ts
export class GetCompatiblePartsUseCase {
  constructor(private readonly repository: SearchRepository) {} // ← interfaz, no Impl
  async execute(input: Input): Promise<Output> {
    // 1. validar reglas de negocio
    // 2. delegar I/O al repo
    // 3. aplicar reglas de ordenamiento/derivadas
  }
}
```

## Patrón Composition Root (`di.ts`)

```ts
const dataSource = new SearchMockDataSource();        // o SearchHttpDataSource(http)
const repository = new SearchRepositoryImpl(dataSource);
export const searchUseCases = {
  getCompatibleParts: new GetCompatiblePartsUseCase(repository),
} as const;
```

## Contrato de la API REST (backend)

El backend (FastAPI) debe exponer los endpoints que los `*HttpDataSource` esperan. Mantener este contrato sincronizado:

| Método | Ruta | Respuesta |
|--------|------|-----------|
| GET | `/vehicles/brands` | `string[]` |
| GET | `/vehicles/models?brand=` | `string[]` |
| GET | `/vehicles/years?brand=&model=` | `number[]` |
| GET | `/parts/compatible?brand=&model=&year=&category=` | `PartDTO[]` |
| GET | `/catalog/vehicles` | `CatalogVehicleDTO[]` |
| GET | `/catalog/vehicles/{id}` | `CatalogVehicleDTO` |
| GET | `/admin/inventory` | `InventoryItemDTO[]` |
| GET | `/admin/analytics` | `AnalyticsSummaryDTO` |
| PATCH | `/admin/inventory/{id}/stock` | `InventoryItemDTO` |

Backend en capas espejo (ver `fastapi-structure`): `routes → controllers → services → repositories → models`. Los **DTOs del backend (Pydantic v2)** deben mapear 1:1 con los DTOs del frontend (`*DTO.ts`). El servicio backend contiene la lógica de compatibilidad; el frontend no la duplica.

## Migrar de Mock a HTTP

En `di.ts`:
```ts
import { FetchHttpClient } from "@core/http/HttpClient";
const http = new FetchHttpClient(process.env.NEXT_PUBLIC_API_URL!);
const dataSource = new SearchHttpDataSource(http); // antes: new SearchMockDataSource()
```
Ninguna otra capa cambia. Si hay que tocar más de `di.ts`, hay un acoplamiento que corregir.

## Checklist al añadir un feature

- [ ] Entities puras en `domain/entities`
- [ ] Interfaz de repo en `domain/repositories`
- [ ] Use cases con la lógica de negocio
- [ ] DTOs + mappers + datasource (mock **y** http) + repoImpl en `data`
- [ ] Store/hook Zustand que invoca use cases
- [ ] `di.ts` ensamblando todo
- [ ] CSS del feature usando variables `:root`
- [ ] Registrar el avance con el skill `autodrive-worklog`
