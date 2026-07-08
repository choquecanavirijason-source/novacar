# AutoDrive API · Laravel

Backend REST para la interfaz Next.js de AutoDrive (novacar).

## Requisitos

- Docker (recomendado) **o** PHP 8.4+ y Composer

## Inicio rápido con Docker

```bash
cd backend
docker compose up
```

La API queda en `http://localhost:8000`.

Primera vez (migraciones + datos de prueba):

```bash
docker run --rm -v "%cd%:/app" -w /app composer:2 php artisan migrate --force
docker run --rm -v "%cd%:/app" -w /app composer:2 php artisan db:seed --force
```

En PowerShell usa `${PWD}` en lugar de `%cd%`.

## Credenciales de prueba

| Campo | Valor |
|-------|-------|
| Email | `admin@autodrive.com` |
| Password | `demo` |

## Endpoints

| Método | Ruta | Auth |
|--------|------|------|
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Sí |
| POST | `/api/auth/logout` | Sí |
| GET | `/api/vehicles/brands` | No |
| GET | `/api/vehicles/models?brand=` | No |
| GET | `/api/vehicles/years?brand=&model=` | No |
| GET | `/api/parts/compatible` | No |
| GET | `/api/catalog/vehicles` | No |
| GET | `/api/catalog/vehicles/{id}` | No |
| GET | `/api/marketplace/parts` | No |
| GET | `/api/marketplace/parts/{id}` | No |
| GET | `/api/admin/inventory` | Sí |
| GET | `/api/admin/analytics` | Sí |
| PATCH | `/api/admin/inventory/{id}/stock` | Sí |

## Conectar el frontend

En la raíz del proyecto Next.js, crea `.env.local`:

```env
NEXT_PUBLIC_USE_API=true
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Luego:

```bash
npm run dev
```

## CORS

Configura orígenes permitidos en `backend/.env`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Estructura

```
app/Http/Controllers/Api/   → Controladores REST
app/Models/                 → Modelos Eloquent
database/migrations/        → Esquema SQLite/MySQL
database/seeders/           → Datos iniciales
routes/api.php              → Rutas API
```