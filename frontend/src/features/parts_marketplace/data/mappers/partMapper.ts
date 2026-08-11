/**
 * Data · Mapper · partMapper
 * Función pura: MarketplacePartDTO -> MarketplacePart (dominio).
 */

import type {
  MarketplacePart,
  NewMarketplacePart,
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
  discountPercent: dto.discount_percent,
  stock: dto.stock,
  reorderLevel: dto.reorder_level,
  imageUrl: dto.image_url,
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

export const toMarketplacePartPayload = (input: NewMarketplacePart) => ({
  sku: input.sku,
  name: input.name,
  category: input.category,
  brand: input.brand,
  condition: input.condition,
  price: input.price,
  discount_percent: input.discountPercent,
  stock: input.stock,
  reorder_level: input.reorderLevel,
  image_url: input.imageUrl,
  rating: input.rating,
  reviews: input.reviews,
  seller: input.seller,
  free_shipping: input.freeShipping,
  warranty_months: input.warrantyMonths,
  compatible_brands: [...input.compatibleBrands],
  year_from: input.yearFrom,
  year_to: input.yearTo,
  specs: [...input.specs],
  accent_from: input.accentFrom,
  accent_to: input.accentTo,
});
