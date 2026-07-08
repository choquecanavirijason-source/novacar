/**
 * Barrel del sistema de diseño (Atomic Design).
 * Importa desde aquí: import { Button, Card, HeroSplit } from "@ui";
 */

// atoms
export { Button } from "./atoms/Button";
export { Badge } from "./atoms/Badge";
export { Chip } from "./atoms/Chip";
export { Card } from "./atoms/Card";
export { Input } from "./atoms/Input";
export { Skeleton } from "./atoms/Skeleton";
export { Logo } from "./atoms/Logo";
export { Eyebrow } from "./atoms/Eyebrow";
export { RatingStars } from "./atoms/RatingStars";

// molecules
export { LanguageSwitcher } from "./molecules/LanguageSwitcher";
export { StatCard } from "./molecules/StatCard";
export { SearchInput } from "./molecules/SearchInput";
export { SpecBadge } from "./molecules/SpecBadge";
export { SectionHeader } from "./molecules/SectionHeader";
export { EmptyState } from "./molecules/EmptyState";
export { ErrorState } from "./molecules/ErrorState";
export { ProductCard } from "./molecules/ProductCard";

// organisms
export { Navbar } from "./organisms/Navbar";
export { UserTopPanel } from "./organisms/UserTopPanel";
export { Footer } from "./organisms/Footer";

// templates
export { PageShell } from "./templates/PageShell";
export { Section } from "./templates/Section";
export { HeroSplit, HeroVisualShell } from "./templates/HeroSplit";
export type { HeroStat } from "./templates/HeroSplit";
export { CatalogLayout } from "./templates/CatalogLayout";
export { CollectionView } from "./templates/CollectionView";
export { DetailLayout } from "./templates/DetailLayout";
export { CTABand } from "./templates/CTABand";
export { FeatureGrid } from "./templates/FeatureGrid";
export type { FeatureItem } from "./templates/FeatureGrid";
export { TileGrid } from "./templates/TileGrid";
export type { TileItem } from "./templates/TileGrid";
export { PromoRow } from "./templates/PromoRow";
export type { PromoItem } from "./templates/PromoRow";
export { TestimonialGrid } from "./templates/TestimonialGrid";
export type { TestimonialItem } from "./templates/TestimonialGrid";