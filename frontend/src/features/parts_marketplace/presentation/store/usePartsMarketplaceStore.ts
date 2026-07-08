/**
 * Presentation · State (Zustand) · usePartsMarketplaceStore
 * ViewModel del marketplace: facetas + filtros + búsqueda + orden + resultados.
 */

"use client";

import { create } from "zustand";
import type { MarketplacePart, PartCategory, PartCondition } from "../../domain/entities/MarketplacePart";
import {
  emptyFilters,
  type PartFacets,
  type PartFilters,
  type SortOption,
} from "../../domain/entities/PartFilters";
import { marketplaceUseCases } from "../../di";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

interface MarketplaceState {
  facets: PartFacets | null;
  filters: PartFilters;
  results: MarketplacePart[];
  loading: boolean;

  init: (preset?: Partial<PartFilters>) => Promise<void>;
  apply: (patch: Partial<PartFilters>) => Promise<void>;
  toggleCategory: (c: PartCategory) => Promise<void>;
  toggleBrand: (b: string) => Promise<void>;
  toggleCondition: (c: PartCondition) => Promise<void>;
  setSort: (s: SortOption) => Promise<void>;
  setSearch: (q: string) => Promise<void>;
  clear: () => Promise<void>;
  activeCount: () => number;
}

export const usePartsMarketplaceStore = create<MarketplaceState>((set, get) => {
  const run = async (filters: PartFilters) => {
    set({ filters, loading: true });
    const results = await marketplaceUseCases.searchParts.execute(filters);
    set({ results, loading: false });
  };

  return {
    facets: null,
    filters: emptyFilters(),
    results: [],
    loading: false,

    init: async (preset) => {
      const filters = preset ? { ...emptyFilters(), ...preset } : get().filters;
      set({ loading: true, filters });
      const [facets, results] = await Promise.all([
        marketplaceUseCases.getFacets.execute(),
        marketplaceUseCases.searchParts.execute(filters),
      ]);
      set({ facets, results, loading: false });
    },

    apply: (patch) => run({ ...get().filters, ...patch }),
    toggleCategory: (c) => run({ ...get().filters, categories: toggle(get().filters.categories, c) }),
    toggleBrand: (b) => run({ ...get().filters, brands: toggle(get().filters.brands, b) }),
    toggleCondition: (c) => run({ ...get().filters, conditions: toggle(get().filters.conditions, c) }),
    setSort: (sort) => run({ ...get().filters, sort }),
    setSearch: (search) => run({ ...get().filters, search: search || undefined }),
    clear: () => run(emptyFilters()),

    activeCount: () => {
      const f = get().filters;
      return (
        f.categories.length +
        f.brands.length +
        f.conditions.length +
        (f.minPrice != null || f.maxPrice != null ? 1 : 0) +
        (f.vehicleBrand ? 1 : 0) +
        (f.year != null ? 1 : 0) +
        (f.freeShipping ? 1 : 0) +
        (f.withWarranty ? 1 : 0) +
        (f.inStock ? 1 : 0) +
        (f.minRating != null ? 1 : 0)
      );
    },
  };
});
