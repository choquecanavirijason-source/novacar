/**
 * Data · Mapper · partMapper
 * Función pura: MarketplacePartDTO -> MarketplacePart (dominio).
 */

import type {
  MarketplacePart,
  PartCategory,
  PartCondition,
} from "../../domain/entities/MarketplacePart";
import type { MarketplacePartDTO } from "../models/MarketplacePartDTO";

export const toMarketplacePart = (dto: MarketplacePartDTO): MarketplacePart => ({
  id: dto.id,
  sku: dto.sku,
  name: dto.name,
  category: dto.category as PartCategory,
  brand: dto.brand,
  condition: dto.condition as PartCondition,
  price: dto.price,
  originalPrice: dto.original_price,
  stock: dto.stock,
  rating: dto.rating,
  reviews: dto.reviews,
  seller: dto.seller,
  freeShipping: dto.free_shipping,
  warrantyMonths: dto.warranty_months,
  compatibleBrands: dto.compatible_brands,
  yearFrom: dto.year_from,
  yearTo: dto.year_to,
  specs: dto.specs,
  accentFrom: dto.accent_from,
  accentTo: dto.accent_to,
});

export const toMarketplaceParts = (dtos: MarketplacePartDTO[]): MarketplacePart[] =>
  dtos.map(toMarketplacePart);
