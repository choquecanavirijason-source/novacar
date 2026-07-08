/**
 * Domain · Entity · PartFilters & Facets
 * Criterios de filtrado del marketplace y facetas disponibles para construir la UI.
 */

import type { PartCategory, PartCondition } from "./MarketplacePart";

export type SortOption = "relevance" | "price_asc" | "price_desc" | "rating";

export interface PartFilters {
  categories: PartCategory[];
  brands: string[];
  conditions: PartCondition[];
  minPrice?: number;
  maxPrice?: number;
  vehicleBrand?: string;
  year?: number;
  freeShipping?: boolean;
  withWarranty?: boolean;
  inStock?: boolean;
  minRating?: number;
  search?: string;
  sort: SortOption;
}

export const emptyFilters = (): PartFilters => ({
  categories: [],
  brands: [],
  conditions: [],
  sort: "relevance",
});

export interface PartFacets {
  categories: { value: PartCategory; count: number }[];
  brands: string[];
  conditions: PartCondition[];
  vehicleBrands: string[];
  years: number[];
  priceRange: { min: number; max: number };
}
