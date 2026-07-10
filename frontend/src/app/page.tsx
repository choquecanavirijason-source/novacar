/**
 * App Router · Landing (/)
 * Storefront: hero → buscador rápido (marca/carrocería/precio, justo arriba
 * de categorías) → categorías (bento) → marcas → promociones → autos
 * destacados → testimonios → razones para elegirnos.
 */

import { HeroShowcase } from "@features/vehicles_catalog/presentation/components/HeroShowcase";
import { VehicleFinderBar } from "@features/vehicles_catalog/presentation/components/VehicleFinderBar";
import { BrandTicker } from "@features/vehicles_catalog/presentation/components/BrandTicker";
import { FeaturedVehicles } from "@features/vehicles_catalog/presentation/components/FeaturedVehicles";
import { DiscountBanners } from "@features/vehicles_catalog/presentation/components/DiscountBanners";
import { WhyChooseUs } from "@features/vehicles_catalog/presentation/components/WhyChooseUs";
import { Testimonials } from "@features/vehicles_catalog/presentation/components/Testimonials";
import { CategoriesBento } from "@features/parts_marketplace/presentation/components/CategoriesBento";

export default function HomePage() {
  return (
    <>
      <HeroShowcase />
      <VehicleFinderBar />
      <CategoriesBento />
      <BrandTicker />
      <DiscountBanners />
      <FeaturedVehicles />
      <Testimonials />
      <WhyChooseUs />
    </>
  );
}
