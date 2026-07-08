# Adaptación de Tokens · Brator → AutoDrive

Mapeo para replicar el **look Brator** sin romper el design system de AutoDrive.

---

## Principio

> Brator usa naranja/rojo + negro puro. AutoDrive usa cobalto + cyan + negro azulado.
> **Copiamos la estructura y jerarquía**, no los colores literales.

---

## Tabla de mapeo

| Rol visual Brator | Hex Brator | Token AutoDrive | Notas |
|-------------------|------------|-----------------|-------|
| Fondo página | `#000` | `--bg-base` | AutoDrive tiene tinte azul, más premium |
| Fondo sección | `#1a1a1a` | `--bg-surface` | Trust bar, footer sections |
| Fondo card | `#111` | `--bg-elevated` | Product cards |
| Overlay nav | Negro 95% | `--bg-overlay` | Sticky header con blur |
| Texto principal | `#FFF` | `--text-primary` | |
| Texto secundario | `#999` | `--text-secondary` | Nav, subtítulos |
| Texto muted | `#666` | `--text-muted` | Categorías, meta |
| Acento headline | `#FF3D00` | `--accent-neon` | Palabra destacada en H1 |
| Acento logo | Naranja | `--primary-glow` | Icono de marca |
| CTA primario fondo | Negro | `Button variant="primary"` | Usa gradient brand |
| Línea decorativa hero | Rojo | `--accent-neon` | Barra bajo CTA |
| Badge descuento | Rojo | `--danger` o `Badge tone="danger"` | % OFF |
| Badge promo | Azul link | `--accent-neon` | Links en promo strip |
| Borde card | `#333` | `--border` | |
| Borde hover | — | `--border-strong` | + `--glow-accent` |
| Sombra card | Sutil | `--shadow-soft` | |
| Glow hover | — | `--glow-primary` | Category tiles |
| Gradiente headline | — | `--gradient-brand` | `.text-gradient` |
| Éxito / stock | Verde | `--success` | "Disponible" |
| Urgencia / oferta | Naranja | `--warning` | Countdown, limited |
| Error / agotado | Rojo | `--danger` | |

---

## Tokens opcionales (si necesitas más fidelidad Brator)

Si el usuario pide **réplica exacta** del naranja Brator, añadir a `globals.css`
como variante scoped (NO reemplazar tokens globales):

```css
/* Solo dentro de .theme-brator o página específica */
.theme-brator {
  --brator-accent: #ff3d00;
  --brator-accent-soft: rgba(255, 61, 0, 0.14);
}
```

**Default en AutoDrive:** usar `--accent-neon` (cyan). El naranja Brator es referencia,
no obligación.

---

## Tipografía

| Brator | AutoDrive |
|--------|-----------|
| Sans bold genérica | `--font-sans` (Geist) |
| Uppercase nav | `uppercase tracking-widest text-xs` |
| H1 48–64px | `text-4xl md:text-5xl lg:text-6xl font-bold` |
| Section 24px | `SectionHeader` default |
| Product 14px | `text-sm font-medium` |

No añadir fuentes nuevas sin aprobación. Geist es suficiente para el look Brator.

---

## Radios y espaciado

| Elemento | Brator | Token AutoDrive |
|----------|--------|-----------------|
| Cards | ~8–12px | `--radius-lg` (20px) — AutoDrive más redondeado, OK |
| Botones | Rectangulares / pill | `--radius-pill` para CTAs |
| Inputs | 4–8px | `--radius-md` |
| Section padding | 60–80px | `Section` component (32–80px) |

AutoDrive es **más redondeado** que Brator. Mantener tokens AutoDrive; se ve más moderno.

---

## Componentes @ui → Brator

| Patrón Brator | Componente @ui |
|---------------|----------------|
| Product card | `Card` + custom content o nuevo `VehicleCard` |
| CTA negro | `Button variant="primary"` |
| CTA secundario | `Button variant="ghost"` |
| Badge % off | `Badge tone="danger"` |
| Badge nuevo | `Badge tone="neon"` |
| Filtro tabs | `Chip` |
| Búsqueda header | `SearchInput` |
| Estrellas | `RatingStars` |
| Section title | `SectionHeader` |
| KPI / stat | `StatCard` |
| Loading | `Skeleton` |
| Empty | `EmptyState` |
| Error | `ErrorState` |

---

## Gradientes y fondos

Brator: fondo negro plano.
AutoDrive: mesh gradient cobalto/cyan en `body`.

**Para secciones Brator-style:** usar `bg-[var(--bg-surface)]` sólido en trust bar
y promo sections. El mesh global del body aporta profundidad sin copiar el flat black.

```tsx
{/* Sección estilo Brator — fondo sólido */}
<Section className="bg-[var(--bg-surface)]">...</Section>

{/* Hero — dejar transparente para mesh del body */}
<Section className="bg-transparent">...</Section>
```

---

## Checklist de adaptación

- [ ] Cero `#FF3D00`, `#000`, `#FFF` sueltos en código
- [ ] Headline accent usa `text-gradient` o `--accent-neon`
- [ ] Badges usan `tone` de `@ui`, no colores custom
- [ ] Botones usan `Button` de `@ui`
- [ ] Fondos usan `--bg-*` tokens
- [ ] i18n completo ES/EN