---
name: autodrive-admin-panel
description: Patrones del panel administrativo de AutoDrive (módulo admin_dashboard). Úsalo cuando crees o mejores pantallas de administración, dashboards, tablas de datos, KPIs, gráficos, gestión de inventario, alertas de stock o cualquier vista interna. Define el layout (sidebar + contenido), componentes reutilizables (StatCard, DataTable, MiniBarChart, StockAlert), patrones de carga/edición inline y cómo conectar con los use cases vía el store Zustand.
---

# Panel administrativo AutoDrive

Módulo `src/features/admin_dashboard`. Objetivo: un panel **claro, denso en información pero respirable**, con la estética dark premium del sistema de diseño (`autodrive-design-system`).

## Layout

```
[ AdminSidebar (sticky, 220px) ] [ main: página activa ]
```

- Sidebar fija con navegación por secciones (Analíticas, Inventario, …).
- El contenido cambia por estado local en `AdminDashboard.tsx` (o ruta anidada si crece).
- `main` con `flex: 1; min-width: 0` para que las tablas no desborden.

## Componentes reutilizables

| Componente | Uso |
|------------|-----|
| `StatCard` / `StockAlertCard` | KPI: label + valor grande + acento (`primary`/`neon`/`danger`). Opcional: icono y tendencia. |
| `DataTable<T>` | Tabla genérica tipada. Columnas con `render(row)` y `align`. Header en mayúsculas/`--text-muted`. |
| `MiniBarChart` | Gráfico de barras CSS puro (sin librerías) para series pequeñas. Barras con `--gradient-brand`. |
| `AdminSidebar` | Navegación. Item activo: borde `--primary-glow` + fondo `--primary-soft`. |

## Reglas de UX del panel

1. **KPIs arriba** en grid de 4 columnas (responsive a 2/1). El más crítico (alertas de stock) en `--danger`.
2. **Estados de carga** explícitos: nunca tabla vacía sin feedback. Usar skeleton (`shimmer`) o texto "Cargando…".
3. **Edición inline** (ej. stock): `input` que dispara el use case en `onBlur` solo si cambió el valor. Validación en el use case (`UpdateInventoryStockUseCase` rechaza < 0).
4. **Alertas visibles:** ítems bajo `reorderLevel` se marcan con borde/color `--danger` y badge. La regla `isLowStock(item)` vive en el dominio, no en la UI.
5. **Densidad:** padding de celda `14px 18px`, separadores `1px solid var(--border)`, hover de fila sutil.
6. **Acciones destructivas** con confirmación y color `--danger`.

## Flujo de datos

```
useAdminDashboardStore (Zustand)
   └─ load()        → Promise.all(getAnalyticsSummary, getInventory)
   └─ updateStock() → UpdateInventoryStockUseCase.execute() → actualiza estado local
```

El store NUNCA hace `fetch`; solo invoca `adminUseCases` (composition root `di.ts`).

## Gráficos sin librerías

Para mantener el bundle ligero, los gráficos básicos son **CSS puro**:
- Barras: `div` con `height: ${pct}%` y `background: var(--gradient-brand)`.
- Tendencias: usar color (`--success`/`--danger`) + flecha ▲▼.
- Si se necesita algo complejo (líneas, áreas), recién ahí evaluar una librería ligera.

## Checklist para una nueva vista admin

- [ ] Datos vía store → use case (no fetch directo)
- [ ] Estado de carga y de error manejados
- [ ] KPIs con `StatCard`, listados con `DataTable`
- [ ] Reglas de negocio (alertas, validaciones) en el dominio
- [ ] Estilos con tokens `:root`, responsive
- [ ] Registrar avance con `autodrive-worklog`
