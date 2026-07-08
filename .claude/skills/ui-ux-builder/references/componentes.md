# Patrones de Componentes UI

## Cards de producto / item

```tsx
<Card animate style={{ animationDelay: `${i * 50}ms` }}>
  <div className="card-media">{/* imagen o gradiente */}</div>
  <div className="card-body">
    <h3>{title}</h3>
    <div className="specs">{/* SpecBadge row */}</div>
    <p className="price">{price}</p>
  </div>
  <div className="card-footer">
    <Button variant="primary" size="sm" href={detailUrl}>
      {t("common.viewDetails")}
    </Button>
  </div>
</Card>
```

- Media con aspect-ratio fijo (evita CLS)
- Título max 2 líneas (`line-clamp-2`)
- Precio destacado con `--text-primary`
- Hover: `translateY(-4px)` + `--glow-primary` sutil

---

## SectionHeader (patrón estándar)

```tsx
<SectionHeader
  eyebrow={t("section.eyebrow")}
  title={t("section.title")}
  subtitle={t("section.subtitle")}
  align="left" // o "center" en heroes
/>
```

- Eyebrow: usar con moderación (max 1 cada 3 secciones en marketing)
- Subtitle max 65ch de ancho
- En AutoDrive: siempre via `SectionHeader`, no reinventar

---

## Navbar

- Logo izquierda, nav centro/derecha, CTA + LanguageSwitcher derecha
- Altura 64–72px desktop
- Sticky con `backdrop-blur` y `--bg-overlay`
- Móvil ≤560px: hamburger → drawer/overlay
- Item activo: color `--accent-neon` o underline

---

## Filtros (sidebar)

```tsx
<aside className="filters-sidebar">
  <div className="filter-group">
    <h4>{t("filters.category")}</h4>
    {options.map(opt => (
      <Chip key={opt.id} active={selected === opt.id} onClick={() => toggle(opt.id)}>
        {opt.label}
      </Chip>
    ))}
  </div>
  {/* más grupos separados por border */}
</aside>
```

- Grupos separados por `1px solid var(--border)`
- Títulos de grupo en `--text-muted`, uppercase pequeño
- Sticky `top: 88px` en desktop
- Colapsa debajo del toolbar en móvil

---

## Toolbar de resultados

```tsx
<div className="results-toolbar">
  <SearchInput value={q} onChange={setQ} placeholder={t("search.placeholder")} />
  <span className="results-count">{t("search.results", { n: total })}</span>
  <select aria-label={t("search.sortBy")}>{/* opciones */}</select>
</div>
```

- Búsqueda + conteo + orden en una fila (wrap en móvil)
- `aria-live="polite"` en el conteo

---

## Modales

```tsx
<dialog open={isOpen} onClose={onClose} aria-labelledby="modal-title">
  <div className="modal-header">
    <h2 id="modal-title">{title}</h2>
    <button aria-label={t("common.close")} onClick={onClose}>×</button>
  </div>
  <div className="modal-body">{children}</div>
  <div className="modal-footer">
    <Button variant="ghost" onClick={onClose}>{t("common.cancel")}</Button>
    <Button variant="primary" onClick={onConfirm}>{t("common.confirm")}</Button>
  </div>
</dialog>
```

- Focus trap dentro del modal
- Escape cierra (salvo acciones críticas)
- Fondo `--bg-overlay` con blur
- Entrada: `scale(0.95)` → `scale(1)` + opacity

---

## Toasts / notificaciones

- Posición: top-right o bottom-center
- Duración: 4–6s éxito, persistente en error crítico
- Icono + mensaje + opcional acción (deshacer)
- `role="status"` éxito, `role="alert"` error
- No bloquear interacción del resto de la UI

---

## Paginación

```tsx
<nav aria-label={t("pagination.label")}>
  <Button variant="ghost" disabled={page === 1} onClick={prev}>←</Button>
  <span>{t("pagination.pageOf", { current: page, total: pages })}</span>
  <Button variant="ghost" disabled={page === pages} onClick={next}>→</Button>
</nav>
```

- Siempre mostrar contexto (página X de Y o rango de items)
- Botones disabled con `aria-disabled` cuando corresponda

---

## Tabs

- Tab activo: borde inferior `--accent-neon` o background `--bg-elevated`
- `role="tablist"`, `role="tab"`, `aria-selected`
- Navegación con flechas izquierda/derecha
- No más de 5–7 tabs visibles; overflow → dropdown "Más"

---

## Breadcrumbs

```
Inicio > Autos > SUV > Toyota RAV4 2024
```

- Separador consistente (`>` o `/`)
- Último item no es link (página actual)
- `aria-label="Breadcrumb"` en `<nav>`
- Colapsar en móvil: `Inicio > … > Actual`

---

## KPI row (admin / dashboard)

```tsx
<div className="kpi-grid">
  {metrics.map(m => (
    <StatCard
      key={m.id}
      label={m.label}
      value={m.value}
      hint={m.change}
      tone={m.critical ? "danger" : "default"}
    />
  ))}
</div>
```

- Grid `repeat(4, 1fr)` → 2 → 1 en breakpoints
- Métrica crítica con `--danger`
- Skeleton por card, no spinner global

---

## Cuándo crear un componente nuevo en @ui

Crear en `src/ui/` si:
- Se usará en 2+ features
- Es agnóstico al dominio (solo props, sin lógica de negocio)
- Encaja en la jerarquía atom/molecule/organism

Mantener en el feature si:
- Es específico de un módulo (ej. `VehicleDetailGallery`)
- Tiene lógica de dominio acoplada