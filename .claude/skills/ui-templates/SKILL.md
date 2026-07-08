---
name: ui-templates
description: >
  Catálogo de templates UI premium de AutoDrive para construir páginas y secciones con
  diseño excelente desde el primer render. Define cuándo usar cada template (@ui/templates),
  cómo componerlos con SectionHeader, estados integrados y ejemplos de código.
  Úsalo junto con ui-ux-builder y autodrive-design-system cuando crees páginas nuevas,
  landings, catálogos, detalle, CTAs o secciones de marketing. Slash: /ui-templates.
---

# UI Templates · AutoDrive

Templates listos para producir interfaces **premium sin reinventar layout**.
Importa desde `@ui` y compón con datos del feature.

## Regla de oro

```
1. Elige el template según el tipo de página/sección (tabla abajo)
2. Pasa contenido por props / slots — el template controla espaciado y responsive
3. Textos via t() — nunca literales
4. Estados via CollectionView o EmptyState/ErrorState
5. SectionHeader para títulos de sección
```

Cargar también: `autodrive-design-system`, `ui-ux-builder`.

---

## Catálogo de templates

| Template | Cuándo usarlo | Import |
|----------|---------------|--------|
| `HeroSplit` | Hero landing: texto + visual, stats, CTAs | `@ui` |
| `Section` | Envoltura de sección con padding consistente | `@ui` |
| `PageShell` | Página interna simple (título + contenido) | `@ui` |
| `CatalogLayout` | Sidebar filtros + grid resultados | `@ui` |
| `CollectionView` | Grid con loading/empty/error automático | `@ui` |
| `DetailLayout` | Página detalle: media + info | `@ui` |
| `CTABand` | Banda de conversión al final de sección | `@ui` |
| `FeatureGrid` | Beneficios / why choose us (4 cols) | `@ui` |
| `TileGrid` | Categorías / tiles con icono | `@ui` |
| `PromoRow` | 3 banners promocionales | `@ui` |
| `TestimonialGrid` | Testimonios en grid | `@ui` |
| `EmptyState` | Lista vacía, sin resultados | `@ui` |
| `ErrorState` | Error con retry | `@ui` |

Detalle y ejemplos: `references/catalogo.md`.

---

## Recetas por tipo de página

### Landing / Home

```
HeroSplit
  → Section + SectionHeader + TileGrid      (categorías)
  → Section + PromoRow                      (promos)
  → Section + SectionHeader + CollectionView (destacados)
  → Section + SectionHeader + FeatureGrid   (beneficios)
  → Section + SectionHeader + TestimonialGrid
  → Section + CTABand                       (cierre)
```

### Catálogo / Marketplace

```
PageShell o SectionHeader
  → CatalogLayout
      sidebar: filtros (Chip groups)
      toolbar: SearchInput + conteo
      children: CollectionView → cards del feature
```

### Detalle de producto / vehículo

```
PageShell (breadcrumb opcional)
  → DetailLayout
      media: foto / visual
      info: título, specs, precio, CTA
```

### Página interna / formulario

```
PageShell
  → formulario con Input + Button
  → EmptyState si no hay datos previos
```

---

## Ejemplo: Hero de landing

```tsx
import { HeroSplit, HeroVisualShell, Button } from "@ui";
import { useTranslation } from "@core/i18n/I18nProvider";

export function HomeHero() {
  const { t } = useTranslation();

  return (
    <HeroSplit
      eyebrow={t("home.heroBadge")}
      title={<>{t("hero.titleA")} <span className="text-gradient">{t("hero.titleHighlight")}</span></>}
      subtitle={t("hero.subtitle")}
      actions={
        <>
          <Button href="/autopartes">{t("home.shopNow")}</Button>
          <Button href="/catalogo" variant="ghost">{t("hero.ctaCars")}</Button>
        </>
      }
      stats={[
        { value: "1,200+", label: t("hero.statCars") },
        { value: "8,500+", label: t("hero.statParts") },
        { value: "100%", label: t("hero.statCompat") },
      ]}
      visual={
        <HeroVisualShell>
          <span style={{ fontSize: "7rem" }} aria-hidden>🚗</span>
        </HeroVisualShell>
      }
    />
  );
}
```

---

## Ejemplo: Catálogo con estados

```tsx
import { CatalogLayout, CollectionView, SearchInput } from "@ui";

<CatalogLayout
  sidebar={<CatalogFilters />}
  toolbar={
    <>
      <SearchInput value={q} onChange={setQ} placeholder={t("catalog.searchPlaceholder")} />
      <span>{t("catalog.count", { n: items.length })}</span>
    </>
  }
>
  <CollectionView
    items={items}
    loading={loading}
    error={error}
    onRetry={refetch}
    getKey={(v) => v.id}
    renderItem={(v, i) => <VehicleCard vehicle={v} index={i} />}
    emptyTitle={t("catalog.emptyTitle")}
    emptyMessage={t("catalog.empty")}
    emptyIcon="🔍"
  />
</CatalogLayout>
```

---

## CSS

Estilos en `src/ui/templates/templates.css` (importado globalmente en layout).
Clases prefijo `tpl-`. **No duplicar** en features; extiende con `className` si necesario.

---

## Checklist al usar templates

- [ ] Template correcto para el tipo de sección
- [ ] `Section` + `SectionHeader` en bloques de contenido
- [ ] `CollectionView` en toda lista con datos async
- [ ] Textos en `t()` (ES + EN)
- [ ] Visual slot del hero con contenido real (no solo emoji si hay assets)
- [ ] Mobile collapse viene del template (no override que rompa grid)

---

## Referencias

| Archivo | Contenido |
|---------|-----------|
| `references/catalogo.md` | API de cada template, props, anti-patrones |
| `references/recetas-pagina.md` | Composición completa por tipo de página |