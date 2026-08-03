/**
 * Presentation · State (Zustand) · useVehicleAdminStore
 * ViewModel del CRUD de autos del catálogo (panel admin). Separado de
 * `useCatalogStore` (que maneja filtros del explorador público) para no
 * mezclar responsabilidades de lectura pública y gestión administrativa.
 */

"use client";

import { create } from "zustand";
import type { CatalogVehicle, NewCatalogVehicle } from "../../domain/entities/CatalogVehicle";
import { catalogUseCases } from "../../di";

interface VehicleAdminState {
  vehicles: CatalogVehicle[];
  loading: boolean;
  error: string | null;

  load: () => Promise<void>;
  create: (input: NewCatalogVehicle) => Promise<boolean>;
  update: (id: string, input: NewCatalogVehicle) => Promise<boolean>;
  remove: (id: string) => Promise<void>;
}

export const useVehicleAdminStore = create<VehicleAdminState>((set, get) => ({
  vehicles: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const vehicles = await catalogUseCases.getAllVehicles();
      set({ vehicles, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  create: async (input) => {
    try {
      const created = await catalogUseCases.createVehicle.execute(input);
      set({ vehicles: [created, ...get().vehicles] });
      return true;
    } catch (e) {
      set({ error: (e as Error).message });
      return false;
    }
  },

  update: async (id, input) => {
    try {
      const updated = await catalogUseCases.updateVehicle.execute(id, input);
      set({ vehicles: get().vehicles.map((v) => (v.id === id ? updated : v)) });
      return true;
    } catch (e) {
      set({ error: (e as Error).message });
      return false;
    }
  },

  remove: async (id) => {
    try {
      await catalogUseCases.deleteVehicle.execute(id);
      set({ vehicles: get().vehicles.filter((v) => v.id !== id) });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));
