/**
 * App Router · Landing (/)
 * Storefront: hero → categorías (bento) → promociones → autos destacados →
 * testimonios → razones para elegirnos.
 */

import { HeroShowcase } from "@features/vehicles_catalog/presentation/components/HeroShowcase";
import { FeaturedVehicles } from "@features/vehicles_catalog/presentation/components/FeaturedVehicles";
import { DiscountBanners } from "@features/vehicles_catalog/presentation/components/DiscountBanners";
import { WhyChooseUs } from "@features/vehicles_catalog/presentation/components/WhyChooseUs";
import { Testimonials } from "@features/vehicles_catalog/presentation/components/Testimonials";
import { CategoriesBento } from "@features/parts_marketplace/presentation/components/CategoriesBento";

export default function HomePage() {
  return (
    <>
      <HeroShowcase />
      <CategoriesBento />
      <DiscountBanners />
      <FeaturedVehicles />
      <Testimonials />
      <WhyChooseUs />
    </>
  );
}
