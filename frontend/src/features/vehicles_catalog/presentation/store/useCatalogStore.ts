/**
 * Presentation · State (Zustand) · useCatalogStore
 * ViewModel del explorador de autos: filtros reactivos + resultados.
 */

"use client";

import { create } from "zustand";
import type {
  CatalogFilterOptions,
  CatalogVehicle,
  VehicleFilters,
} from "../../domain/entities/CatalogVehicle";
import { catalogUseCases } from "../../di";

interface CatalogState {
  vehicles: CatalogVehicle[];
  options: CatalogFilterOptions | null;
  filters: VehicleFilters;
  loading: boolean;

  init: () => Promise<void>;
  setFilter: <K extends keyof VehicleFilters>(key: K, value: VehicleFilters[K]) => Promise<void>;
  clearFilters: () => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  vehicles: [],
  options: null,
  filters: {},
  loading: false,

  init: async () => {
    set({ loading: true });
    const [options, vehicles] = await Promise.all([
      catalogUseCases.filterVehicles.getOptions(),
      catalogUseCases.filterVehicles.execute({}),
    ]);
    set({ options, vehicles, loading: false });
  },

  setFilter: async (key, value) => {
    // toggle: si se reselecciona el mismo valor, se limpia ese filtro
    const current = get().filters;
    const next: VehicleFilters = {
      ...current,
      [key]: current[key] === value ? undefined : value,
    };
    set({ filters: next, loading: true });
    const vehicles = await catalogUseCases.filterVehicles.execute(next);
    set({ vehicles, loading: false });
  },

  clearFilters: async () => {
    set({ filters: {}, loading: true });
    const vehicles = await catalogUseCases.filterVehicles.execute({});
    set({ vehicles, loading: false });
  },
}));
