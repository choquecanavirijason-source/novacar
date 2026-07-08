# Estructura Home · Venta de Autos Brator

Orden de secciones para la página principal. **No reordenar** sin justificación UX.

---

## Mapa completo

```
┌─────────────────────────────────────────┐
│ 1. PromoBanner (strip fino)             │
├─────────────────────────────────────────┤
│ 2. Navbar (logo + nav + search + icons) │
├─────────────────────────────────────────┤
│ 3. HeroVehicle (foto + headline + CTA)  │
├─────────────────────────────────────────┤
│ 4. TrustBar (4 beneficios)              │
├─────────────────────────────────────────┤
│ 5. VehicleFinder (año/marca/modelo)     │
├─────────────────────────────────────────┤
│ 6. CategoryTiles (SUV, Sedán, Pickup…)  │
├─────────────────────────────────────────┤
│ 7. FeaturedVehicles (tabs + grid)       │
├─────────────────────────────────────────┤
│ 8. PromoBento (banners asimétricos)     │
├─────────────────────────────────────────┤
│ 9. BrandCarousel (logos marcas)         │
├─────────────────────────────────────────┤
│ 10. BestSellers (countdown + grid)      │
├─────────────────────────────────────────┤
│ 11. NewArrivals (grid recién llegados)  │
├─────────────────────────────────────────┤
│ 12. CTABand (cierre conversión)         │
├─────────────────────────────────────────┤
│ 13. Footer (global)                     │
└─────────────────────────────────────────┘
```

---

## Sección por sección

### 1. PromoBanner

```tsx
<div className="bg-[var(--bg-surface)] py-2 text-center text-sm">
  <span>{t("promo.message")}</span>
  <Link href="/catalogo" className="ml-2 text-[var(--accent-neon)]">
    {t("promo.cta")}
  </Link>
</div>
```

- Altura mínima, no compite con hero
- Opcional: dismissible en mobile

---

### 2. Navbar

Usar `Navbar` existente + extensiones:
- `SearchInput` con placeholder `t("search.byVehicle")`
- Teléfono: `t("contact.phone")` con icono
- Iconos: favoritos, carrito/compare
- Nav links: Inicio, Catálogo, Nosotros, Contacto

---

### 3. HeroVehicle

Template: `HeroSplit`

```tsx
<HeroSplit
  eyebrow={t("hero.eyebrow")}
  title={
    <>
      {t("hero.line1")}<br />
      {t("hero.line2")}<br />
      <span className="text-gradient">{t("hero.line3Accent")}</span>
    </>
  }
  subtitle={t("hero.subtitle")}
  actions={
    <Button href="/catalogo" size="md">
      {t("hero.cta")}
    </Button>
  }
  visual={<HeroVehicleImage src={heroImage} alt={t("hero.imageAlt")} />}
/>
```

**i18n ejemplo ES:**
- line1: "Encuentra el"
- line2: "vehículo perfecto"
- line3Accent: "para ti"
- cta: "Ver catálogo"

---

### 4. TrustBar

Template: `FeatureGrid` con 4 items

```tsx
<Section size="sm" className="bg-[var(--bg-surface)]">
  <FeatureGrid
    columns={4}
    items={[
      { icon: <TruckIcon />, title: t("trust.delivery"), description: t("trust.deliveryDesc") },
      { icon: <ShieldIcon />, title: t("trust.quality"), description: t("trust.qualityDesc") },
      { icon: <HeadsetIcon />, title: t("trust.support"), description: t("trust.supportDesc") },
      { icon: <RefreshIcon />, title: t("trust.returns"), description: t("trust.returnsDesc") },
    ]}
  />
</Section>
```

Mobile: 2×2 grid o carousel horizontal.

---

### 5. VehicleFinder

Organismo nuevo o sección en home:

```tsx
<Section>
  <SectionHeader
    title={t("finder.title")}
    subtitle={t("finder.subtitle")}
  />
  <VehicleFinderForm
    years={years}
    brands={brands}
    models={models}
    fuelTypes={fuelTypes}
    onSearch={(filters) => router.push(`/catalogo?${qs(filters)}`)}
  />
</Section>
```

Campos: Año, Marca, Modelo, Combustible (opcional: precio máx).

---

### 6. CategoryTiles

Template: `TileGrid`

Categorías sugeridas para venta de autos:
- SUV
- Sedán
- Pickup
- Hatchback
- Eléctricos
- Híbridos
- Deportivos
- Familiares

Cada tile: icono/imagen + nombre + subtítulo corto.

---

### 7. FeaturedVehicles

```tsx
<Section>
  <div className="flex flex-wrap items-center justify-between gap-4">
    <SectionHeader title={t("featured.title")} />
    <ChipGroup
      options={categories}
      active={activeTab}
      onChange={setActiveTab}
    />
  </div>
  <CollectionView
    items={filteredVehicles}
    renderItem={(v) => <VehicleCard vehicle={v} />}
    loading={loading}
    empty={<EmptyState title={t("featured.empty")} />}
    error={<ErrorState onRetry={refetch} />}
  />
</Section>
```

Grid: `repeat(auto-fill, minmax(220px, 1fr))`, gap 18.

---

### 8. PromoBento

Template: `PromoRow` con 2–4 banners

Ejemplos de promos (autos):
- "Financiamiento 0% APR"
- "Trade-in: valoramos tu auto"
- "Garantía extendida 3 años"
- "Super Sale: hasta 70% en seleccionados"

Layout bento: 1 celda grande + 2–3 pequeñas.

---

### 9. BrandCarousel

Scroll horizontal de logos:
Toyota, Ford, BMW, Mercedes, Honda, Nissan, Audi, Chevrolet…

```tsx
<div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
  {brands.map((b) => (
    <Link key={b.id} href={`/catalogo?brand=${b.slug}`} className="shrink-0 opacity-70 hover:opacity-100">
      <img src={b.logo} alt={b.name} className="h-10 w-auto" />
    </Link>
  ))}
</div>
```

Tabs opcionales: "Marcas destacadas" | "Modelos populares"

---

### 10. BestSellers

- Título + countdown ("Expira en: D : H : M : S")
- Tabs: Top 10 | SUV | Sedán | Eléctricos
- Grid con `VehicleCard` + `Badge` de descuento

Countdown: componente client aislado con cleanup.

---

### 11. NewArrivals

Similar a FeaturedVehicles pero sin tabs.
Título: `t("newArrivals.title")` + link "Ver todos".

---

### 12. CTABand

```tsx
<CTABand
  title={t("ctaBand.title")}
  subtitle={t("ctaBand.subtitle")}
  actions={
    <>
      <Button href="/catalogo">{t("ctaBand.primary")}</Button>
      <Button href="/contacto" variant="ghost">{t("ctaBand.secondary")}</Button>
    </>
  }
/>
```

---

## Responsive collapse

| Sección | Desktop | Tablet (≤900px) | Mobile (≤560px) |
|---------|---------|-----------------|-----------------|
| Hero | Split 50/50 | Visual arriba | Stack vertical |
| TrustBar | 4 cols | 2×2 | 2×2 o scroll |
| VehicleFinder | 4 selects + btn fila | 2×2 + btn | Stack |
| CategoryTiles | 4–6 cols | 3 cols | 2 cols |
| Vehicle grid | 4–5 cols | 3 cols | 1–2 cols |
| BrandCarousel | scroll | scroll | scroll |
| PromoBento | bento asimétrico | 2 cols | 1 col |

---

## Datos y estados

Cada sección con fetch async necesita:
- **Loading:** `Skeleton` grid
- **Empty:** `EmptyState` con CTA al catálogo
- **Error:** `ErrorState` con retry

Mock data debe usar dominio automotriz real (marcas, modelos, precios USD/MXN).