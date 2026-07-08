/**
 * Domain · Use Case · SearchParts
 * Lógica pura de filtrado + ordenamiento del marketplace.
 */

import type { MarketplacePart } from "../entities/MarketplacePart";
import type { PartFilters } from "../entities/PartFilters";
import type { MarketplaceRepository } from "../repositories/MarketplaceRepository";

const normalize = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export class SearchPartsUseCase {
  constructor(private readonly repository: MarketplaceRepository) {}

  async execute(filters: PartFilters): Promise<MarketplacePart[]> {
    const all = await this.repository.getAll();
    const q = filters.search ? normalize(filters.search) : null;

    const filtered = all.filter((p) => {
      if (filters.categories.length && !filters.categories.includes(p.category)) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.conditions.length && !filters.conditions.includes(p.condition)) return false;
      if (filters.minPrice != null && p.price < filters.minPrice) return false;
      if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
      if (filters.freeShipping && !p.freeShipping) return false;
      if (filters.withWarranty && p.warrantyMonths <= 0) return false;
      if (filters.inStock && p.stock <= 0) return false;
      if (filters.minRating != null && p.rating < filters.minRating) return false;
      if (filters.vehicleBrand && !p.compatibleBrands.includes(filters.vehicleBrand)) return false;
      if (filters.year != null && (p.yearFrom > filters.year || p.yearTo < filters.year)) return false;
      if (q && !normalize(`${p.name} ${p.brand} ${p.category}`).includes(q)) return false;
      return true;
    });

    return this.sort(filtered, filters.sort);
  }

  private sort(parts: MarketplacePart[], sort: PartFilters["sort"]): MarketplacePart[] {
    const list = [...parts];
    switch (sort) {
      case "price_asc":
        return list.sort((a, b) => a.price - b.price);
      case "price_desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      case "relevance":
      default:
        // relevancia: en stock primero, luego mejor calificados
        return list.sort(
          (a, b) => (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0) || b.rating - a.rating,
        );
    }
  }
}
