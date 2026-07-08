# Sistema de Diseño · Atomic Design

UI compartida de AutoDrive organizada con **Atomic Design** (Brad Frost). La interfaz se
compone de piezas cada vez más complejas; las internas no conocen a las externas
(coherente con la Clean Architecture del proyecto).

```
src/ui/
├── atoms/       # Piezas indivisibles: Button, Badge, Chip, Card, Input, Skeleton, Logo, Eyebrow
├── molecules/   # Combinaciones simples: SearchInput, StatCard, SpecBadge, SectionHeader, LanguageSwitcher
├── organisms/   # Secciones autónomas: Navbar, UserTopPanel, Footer
├── templates/   # Layouts premium: HeroSplit, CatalogLayout, CollectionView, CTABand…
└── index.ts     # Barrel: import { Button, Card } from "@ui"
```

- **pages** viven en `src/app/**` (rutas) y en `features/*/presentation/pages/`
  (la composición completa que cada ruta renderiza, ej. `CatalogExplorer`,
  `PartsMarketplace`, `StepWizard`, `AnalyticsPage`); ambas componen los
  elementos de `@ui`.
- Todo consume los tokens `:root` del tema (ver skill `autodrive-design-system`).
- Los textos visibles se traducen con `useTranslation()` (ES/EN, ver `src/core/i18n`).
- **Templates:** usa `HeroSplit`, `CollectionView`, `CatalogLayout`, etc. desde `@ui` para
  páginas con diseño premium sin reinventar CSS (ver skill `ui-templates`).

## Regla de composición

`atom → molecule → organism → template → page`. Un átomo nunca importa una molécula.
Si necesitas estado de negocio, llega por props o desde el store del feature; los
componentes de `@ui` son agnósticos al dominio.
