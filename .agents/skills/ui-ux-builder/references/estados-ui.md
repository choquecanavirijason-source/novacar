# Estados de UI

Toda vista que depende de datos async debe manejar **4 estados**.

---

## 1. Loading

### Skeleton (preferido)

Replica la forma del contenido final:

```tsx
function ProductGridSkeleton() {
  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <Skeleton height={180} />
          <Skeleton height={20} width="70%" />
          <Skeleton height={16} width="50%" />
        </Card>
      ))}
    </div>
  );
}
```

- Misma grid que el contenido real (evita layout shift)
- `shimmer` animation en Skeleton
- Cantidad de placeholders ≈ items esperados (6–8 en grid)

### Cuándo NO usar spinner global

- Grids y listas → skeleton por item
- Botones → spinner inline en el botón
- Spinner fullscreen solo en carga inicial de app

---

## 2. Empty

```tsx
function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">{/* icono contextual */}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}
```

### Por contexto

| Contexto | Título | Acción sugerida |
|----------|--------|-----------------|
| Búsqueda sin resultados | "Sin resultados para '{q}'" | Limpiar filtros / ampliar búsqueda |
| Lista vacía (primera vez) | "Aún no hay autos guardados" | Explorar catálogo |
| Filtros muy restrictivos | "Ningún resultado con estos filtros" | Botón "Limpiar filtros" |
| Error de permisos | "No tienes acceso" | Contactar admin |

- Centrado verticalmente en el área de contenido
- Tono amable, no culpabilizar al usuario
- Siempre ofrecer **siguiente paso**

---

## 3. Error

```tsx
function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="error-state" role="alert">
      <Badge tone="out">{t("common.error")}</Badge>
      <p>{message}</p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          {t("common.retry")}
        </Button>
      )}
    </div>
  );
}
```

### Tipos de error

| Tipo | UI | Mensaje |
|------|-----|---------|
| Red / timeout | ErrorState con retry | "No pudimos cargar los datos. Revisa tu conexión." |
| 404 | Página dedicada | "Esta página no existe" + link inicio |
| 403 | Inline o página | "No tienes permiso" |
| 500 | ErrorState | "Error del servidor. Intenta de nuevo." |
| Validación | Inline bajo campo | Específico por campo |

- Nunca mostrar stack traces al usuario
- Log técnico en consola, mensaje humano en UI

---

## 4. Success / Confirmación

| Acción | Feedback |
|--------|----------|
| Formulario enviado | Toast + redirect o pantalla de gracias |
| Item guardado | Toast breve "Guardado" |
| Item eliminado | Toast + item desaparece de lista (con undo opcional) |
| Filtro aplicado | Conteo actualizado + chips visibles |
| Copiar al portapapeles | Toast "Copiado" 2s |

### Pantalla de éxito (post-formulario)

```
✓  (icono éxito)
Gracias por tu mensaje
Te responderemos en 24–48 horas.
[Volver al inicio]
```

- Confirmar QUÉ pasó y QUÉ sigue
- No dejar al usuario en incertidumbre

---

## Estados de componentes individuales

### Botón

| Estado | Visual |
|--------|--------|
| Default | Estilo base |
| Hover | Glow sutil o background shift |
| Active | `scale(0.98)` |
| Focus | Ring `--glow-accent` |
| Disabled | Opacity 0.5, `cursor: not-allowed` |
| Loading | Spinner inline, texto "Enviando…" |

### Chip / toggle

| Estado | Visual |
|--------|--------|
| Inactive | `--bg-surface`, border sutil |
| Active | `--primary-soft`, border `--primary-glow` |
| Focus | Ring visible |
| `aria-pressed="true"` | Siempre en activo |

### Input

| Estado | Visual |
|--------|--------|
| Default | Border `--border` |
| Focus | Border `--accent-neon`, glow |
| Error | Border `--danger` + mensaje abajo |
| Disabled | Opacity reducida |

---

## Transiciones entre estados

```
loading → content     : fade-in del contenido (no flash)
loading → empty       : transición suave, no parpadeo
loading → error       : mostrar error con retry
content → loading     : skeleton overlay o inline refresh (no borrar todo)
```

Evitar que la UI "parpadee" al refetch: preferir actualización optimista o skeleton inline.