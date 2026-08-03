/**
 * Domain · Use Case · GetPartFacets
 * Deriva las facetas (categorías con conteo, marcas, rangos…) del catálogo completo
 * para construir el sidebar de filtros.
 */

import type { PartCondition } from "../entities/MarketplacePart";
import type { PartFacets } from "../entities/PartFilters";
import type { MarketplaceRepository } from "../repositories/MarketplaceRepository";

export class GetPartFacetsUseCase {
  constructor(private readonly repository: MarketplaceRepository) {}

  async execute(): Promise<PartFacets> {
    const all = await this.repository.getAll();
    const prices = all.map((p) => p.price);

    // Derivado de los datos reales (no de la lista fija de 12): así una
    // categoría que el admin agrega desde el "+" también aparece como filtro.
    const categories = [...new Set(all.map((p) => p.category))].map((value) => ({
      value,
      count: all.filter((p) => p.category === value).length,
    }));

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
