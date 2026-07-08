# Recetas de Página Completa

## Landing e-commerce (AutoDrive)

```tsx
export function LandingPage() {
  return (
    <>
      <HomeHero />  {/* HeroSplit */}

      <Section>
        <SectionHeader eyebrow={...} title={...} subtitle={...} />
        <TileGrid items={categories} />
      </Section>

      <Section size="sm">
        <PromoRow items={promos} />
      </Section>

      <Section>
        <SectionHeader title={...} />
        <FeaturedVehicles />  {/* CollectionView internamente */}
      </Section>

      <Section>
        <SectionHeader title={...} />
        <FeatureGrid items={benefits} />
      </Section>

      <Section>
        <SectionHeader title={...} />
        <TestimonialGrid items={testimonials} />
      </Section>

      <Section size="lg">
        <CTABand
          title={t("cta.title")}
          subtitle={t("cta.subtitle")}
          actions={<Button href="/catalogo">{t("cta.button")}</Button>}
        />
      </Section>
    </>
  );
}
```

---

## Catálogo con filtros

```tsx
export function CatalogPage() {
  return (
    <PageShell
      eyebrow={t("catalog.eyebrow")}
      title={<>{t("catalog.titleA")} <span className="text-gradient">{t("catalog.titleHighlight")}</span></>}
      subtitle={t("catalog.subtitle")}
    >
      <CatalogLayout
        sidebar={<FiltersPanel />}
        toolbar={<CatalogToolbar />}
      >
        <CollectionView ... />
      </CatalogLayout>
    </PageShell>
  );
}
```

---

## Detalle

```tsx
<DetailLayout
  media={<VehiclePhoto vehicle={v} />}
  info={
    <>
      <Badge tone="neon">{v.year}</Badge>
      <h1>{v.model}</h1>
      <SpecBadges specs={v.specs} />
      <p className="price">{formatPrice(v.price)}</p>
      <Button block>{t("detail.contact")}</Button>
    </>
  }
/>
```

---

## Admin KPI + contenido

```tsx
<PageShell title={t("admin.dashboard")}>
  <div className="tpl-grid" style={{ "--tpl-grid-min": "200px" } as CSSProperties}>
    {metrics.map(m => <StatCard key={m.id} {...m} />)}
  </div>
  <Section size="sm">
    {children}
  </Section>
</PageShell>
```

---

## Orden de decisión

```
¿Es hero de landing?     → HeroSplit
¿Es lista con datos?     → CatalogLayout + CollectionView
¿Es detalle 2 cols?    → DetailLayout
¿Es bloque de features?→ FeatureGrid o TileGrid
¿Es cierre conversión? → CTABand
¿Es página simple?     → PageShell
¿Es sección suelta?    → Section + SectionHeader
```