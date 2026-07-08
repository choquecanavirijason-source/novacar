# AutoDrive · Monorepo

Plataforma de venta de **autos y autopartes** (baterías, fusibles, motores, llantas…) con
buscador inteligente de compatibilidad. Tema **dark premium** (azul cobalto + cyan neón).

## Estructura

```
novacar/
├── frontend/     # App Next.js 16 (App Router) · Clean Architecture + Atomic Design + i18n ES/EN
├── backend/      # API / servicio backend
├── docs/         # Documentación (WORKLOG.md, etc.)
├── .claude/      # Skills y configuración de Claude Code (nivel proyecto)
└── .agents/      # Skills instaladas (symlinkeadas a .claude/skills)
```

## Frontend

```bash
cd frontend
npm install     # solo la primera vez
npm run dev     # http://localhost:3001
```

Rutas: `/` · `/catalogo` · `/catalogo/[id]` · `/autopartes` · `/autopartes/[id]` ·
`/buscador` · `/admin` · `/login`.

Documentación de arquitectura y diseño en los skills de `.claude/skills/` y en
[docs/WORKLOG.md](docs/WORKLOG.md). El detalle del frontend está en
[frontend/README.md](frontend/README.md).

## Backend

Ver [backend/](backend/). El frontend consume la API cuando `NEXT_PUBLIC_USE_API=true`
(ver los `di.ts` de cada feature); de lo contrario usa datasources mock in-memory.
