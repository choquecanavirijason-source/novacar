/**
 * Domain · Use Case · GetPartFacets
 * Deriva las facetas (categorías con conteo, marcas, rangos…) del catálogo completo
 * para construir el sidebar de filtros.
 */

import { PART_CATEGORIES, type PartCategory, type PartCondition } from "../entities/MarketplacePart";
import type { PartFacets } from "../entities/PartFilters";
import type { MarketplaceRepository } from "../repositories/MarketplaceRepository";

export class GetPartFacetsUseCase {
  constructor(private readonly repository: MarketplaceRepository) {}

  async execute(): Promise<PartFacets> {
    const all = await this.repository.getAll();
    const prices = all.map((p) => p.price);

    const categories = PART_CATEGORIES.map((value: PartCategory) => ({
      value,
      count: all.filter((p) => p.category === value).length,
    })).filter((c) => c.count > 0);

    const conditions = [...new Set(all.map((p) => p.condition))] as PartCondition[];
    const vehicleBrands = [...new Set(all.flatMap((p) => p.compatibleBrands))].sort();
    const years = [
      ...new Set(all.flatMap((p) => [p.yearFrom, p.yearTo])),
    ].sort((a, b) => b - a);

    return {
      categories,
      brands: [...new Set(all.map((p) => p.brand))].sort(),
      conditions,
      vehicleBrands,
      years,
      priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
    };
  }
}
