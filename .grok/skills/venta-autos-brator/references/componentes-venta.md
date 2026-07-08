# Componentes · Venta de Autos Brator

Recetas listas para copiar/adaptar. Usar `@ui` cuando exista equivalente.

---

## 1. PromoBanner (strip superior)

```tsx
<div
  role="banner"
  className="border-b border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-center text-sm text-[var(--text-secondary)]"
>
  <span>{t("promo.message", { discount: "50%", code: "AUTO50" })}</span>
  <Link
    href="/catalogo"
    className="ml-2 font-medium text-[var(--accent-neon)] underline-offset-2 hover:underline"
  >
    {t("promo.shopNow")}
  </Link>
</div>
```

---

## 2. VehicleCard (grid de autos)

```tsx
<article className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] transition-transform hover:scale-[1.02]">
  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-surface)]">
    <img
      src={vehicle.image}
      alt={vehicle.name}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    {vehicle.discount && (
      <Badge tone="danger" className="absolute left-3 top-3">
        {t("vehicle.discount", { pct: vehicle.discount })}
      </Badge>
    )}
  </div>

  <div className="space-y-2 p-4">
    <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
      {vehicle.category} · {vehicle.brand}
    </p>
    <h3 className="font-medium leading-snug text-[var(--text-primary)]">
      {vehicle.name}
    </h3>
    <RatingStars value={vehicle.rating} reviews={vehicle.reviewCount} />
    <div className="flex items-baseline gap-2 pt-1">
      {vehicle.priceOriginal && (
        <span className="text-sm text-[var(--text-muted)] line-through">
          {formatPrice(vehicle.priceOriginal)}
        </span>
      )}
      <span className="font-bold text-[var(--text-primary)]">
        {vehicle.priceMax
          ? `${formatPrice(vehicle.price)} – ${formatPrice(vehicle.priceMax)}`
          : formatPrice(vehicle.price)}
      </span>
    </div>
    <Button href={`/catalogo/${vehicle.slug}`} variant="ghost" size="sm" block>
      {t("vehicle.viewDetail")}
    </Button>
  </div>
</article>
```

---

## 3. VehicleFinderForm

```tsx
"use client";

export function VehicleFinderForm({ years, brands, models, fuelTypes, onSearch }) {
  const [year, setYear] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [fuel, setFuel] = useState("");

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch({ year, brand, model, fuel }); }}
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select label={t("finder.year")} value={year} onChange={setYear} options={years} />
        <Select label={t("finder.brand")} value={brand} onChange={setBrand} options={brands} />
        <Select label={t("finder.model")} value={model} onChange={setModel} options={models} />
        <Select label={t("finder.fuel")} value={fuel} onChange={setFuel} options={fuelTypes} />
      </div>
      <div className="mt-6 flex justify-end">
        <Button type="submit">{t("finder.search")}</Button>
      </div>
    </form>
  );
}
```

Mobile: `grid-cols-1`, botón full-width.

---

## 4. TrustBar (4 beneficios)

```tsx
<ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
  {items.map((item) => (
    <li key={item.key} className="flex flex-col items-center gap-2 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-soft)] text-[var(--accent-neon)]">
        {item.icon}
      </span>
      <span className="text-sm font-medium text-[var(--text-primary)]">{item.title}</span>
      <span className="text-xs text-[var(--text-muted)]">{item.description}</span>
    </li>
  ))}
</ul>
```

---

## 5. CategoryTabChips (filtros de sección)

```tsx
<div className="flex flex-wrap gap-2" role="tablist">
  {tabs.map((tab) => (
    <Chip
      key={tab.id}
      active={active === tab.id}
      onClick={() => onChange(tab.id)}
      role="tab"
      aria-selected={active === tab.id}
    >
      {tab.label}
    </Chip>
  ))}
</div>
```

Tabs sugeridos autos: Todos | SUV | Sedán | Pickup | Eléctricos | Deportivos

---

## 6. PromoBentoCard

```tsx
<Link
  href={promo.href}
  className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:col-span-2 md:row-span-2"
>
  {promo.badge && (
    <Badge tone="neon" className="mb-3">{promo.badge}</Badge>
  )}
  <h3 className="text-xl font-bold text-[var(--text-primary)] md:text-2xl">
    {promo.title}
  </h3>
  <p className="mt-2 text-sm text-[var(--text-secondary)]">{promo.subtitle}</p>
  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-neon)] group-hover:gap-2 transition-all">
    {t("promo.shopNow")} →
  </span>
  {promo.image && (
    <img
      src={promo.image}
      alt=""
      className="absolute bottom-0 right-0 h-32 w-auto opacity-80 md:h-48"
    />
  )}
</Link>
```

Grid contenedor:
```css
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 16px;
/* 1 card grande col-span-2 row-span-2 + 2–3 pequeñas */
```

---

## 7. BrandCarousel

```tsx
<div className="relative">
  <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
    {brands.map((brand) => (
      <Link
        key={brand.slug}
        href={`/catalogo?brand=${brand.slug}`}
        className="flex shrink-0 snap-start flex-col items-center gap-2 opacity-60 transition-opacity hover:opacity-100"
      >
        <img src={brand.logo} alt={brand.name} className="h-10 w-auto object-contain" />
        <span className="text-xs text-[var(--text-muted)]">{brand.name}</span>
      </Link>
    ))}
  </div>
</div>
```

---

## 8. CountdownTimer (Best Sellers)

```tsx
"use client";

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState(calcRemaining(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(calcRemaining(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-3 text-sm" aria-live="polite">
      <span className="text-[var(--text-muted)]">{t("countdown.expiresIn")}</span>
      {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
        <span key={unit} className="rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] px-2 py-1 font-mono font-bold text-[var(--accent-neon)]">
          {time[unit]}
          <span className="ml-0.5 text-[10px] text-[var(--text-muted)]">
            {t(`countdown.${unit}`)}
          </span>
        </span>
      ))}
    </div>
  );
}
```

---

## 9. Hero con línea de acento (estilo Brator)

```tsx
<div className="space-y-6">
  <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
  <h1 className="text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">
    {t("hero.line1")}<br />
    {t("hero.line2")}<br />
    <span className="text-gradient">{t("hero.line3Accent")}</span>
  </h1>
  <Button href="/catalogo">{t("hero.cta")}</Button>
  {/* Línea de acento decorativa estilo Brator */}
  <div className="h-0.5 w-16 bg-[var(--accent-neon)]" aria-hidden="true" />
</div>
```

---

## 10. Navbar extendido (búsqueda + acciones)

```tsx
<header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-base)]/95 backdrop-blur-md">
  <div className="container flex h-16 items-center gap-4 md:h-20">
    <Logo />
    <nav className="hidden items-center gap-6 md:flex">
      {navLinks.map((l) => (
        <Link key={l.href} href={l.href} className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          {l.label}
        </Link>
      ))}
    </nav>
    <div className="ml-auto flex items-center gap-3">
      <SearchInput placeholder={t("search.byVehicle")} className="hidden w-48 lg:block xl:w-64" />
      <a href={`tel:${phone}`} className="hidden text-sm text-[var(--text-secondary)] lg:block">
        {phone}
      </a>
      <Button variant="ghost" size="sm" aria-label={t("nav.wishlist")}>♡</Button>
      <Button variant="ghost" size="sm" aria-label={t("nav.compare")}>⚖</Button>
    </div>
  </div>
</header>
```

---

## i18n keys sugeridas (añadir a dictionaries.ts)

```ts
// ES
promo: { message: "Oferta especial | Hasta {{discount}} con código {{code}}", shopNow: "Ver ofertas" },
hero: { eyebrow: "Concesionario premium", line1: "Encuentra el", line2: "vehículo perfecto", line3Accent: "para ti", cta: "Ver catálogo", imageAlt: "Vehículo destacado" },
trust: { delivery: "Entrega a domicilio", quality: "Calidad garantizada", support: "Soporte 24/7", returns: "30 días de devolución" },
finder: { title: "Buscar por vehículo", subtitle: "Filtra por año, marca y modelo", year: "Año", brand: "Marca", model: "Modelo", fuel: "Combustible", search: "Buscar" },
vehicle: { viewDetail: "Ver detalle", discount: "-{{pct}}%" },
featured: { title: "Destacados", empty: "No hay vehículos en esta categoría" },
countdown: { expiresIn: "Expira en:", days: "D", hours: "H", minutes: "M", seconds: "S" },
```

Añadir equivalente EN para cada key.