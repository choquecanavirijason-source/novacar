/**
 * Presentation · State (Zustand) · useSearchWizardState
 *
 * ViewModel del buscador por pasos. Carga una vez el catálogo real de
 * vehículos (`vehicles_catalog`) y el inventario real de autopartes
 * (`parts_marketplace`), y usa los Use Cases puros del dominio de este
 * módulo para derivar opciones y filtrar compatibilidad — sin datos
 * inventados ni desconectados del panel admin.
 */

"use client";

import { create } from "zustand";
import { catalogUseCases, type CatalogVehicle } from "@features/vehicles_catalog";
import { marketplaceUseCases, type MarketplacePart, type PartCategory } from "@features/parts_marketplace";
import { searchUseCases } from "../../di";

export type WizardStep = 0 | 1 | 2 | 3; // marca, modelo, año, categoría

interface SearchWizardState {
  // selección
  step: WizardStep;
  brand: string | null;
  model: string | null;
  year: number | null;
  category: PartCategory | null;

  // catálogo real, cargado una vez
  vehicles: CatalogVehicle[];
  allParts: MarketplacePart[];

  // opciones derivadas reactivamente
  brands: string[];
  models: string[];
  years: number[];

  // resultados
  parts: MarketplacePart[];
  loading: boolean;
  error: string | null;

  init: () => Promise<void>;
  selectBrand: (brand: string) => void;
  selectModel: (model: string) => void;
  selectYear: (year: number) => void;
  selectCategory: (category: PartCategory) => void;
  goTo: (step: WizardStep) => void;
  reset: () => void;
}

export const useSearchWizardState = create<SearchWizardState>((set, get) => ({
  step: 0,
  brand: null,
  model: null,
  year: null,
  category: null,
  vehicles: [],
  allParts: [],
  brands: [],
  models: [],
  years: [],
  parts: [],
  loading: false,
  error: null,

  init: async () => {
    set({ loading: true, error: null });
    try {
      const [vehicles, allParts] = await Promise.all([
        catalogUseCases.getAllVehicles(),
        marketplaceUseCases.getAllParts(),
      ]);
      const brands = searchUseCases.deriveVehicleOptions.getBrands(vehicles);
      set({ vehicles, allParts, brands, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  selectBrand: (brand) => {
    const { vehicles } = get();
    const models = searchUseCases.deriveVehicleOptions.getModels(vehicles, brand);
    set({ brand, model: null, year: null, category: null, models, years: [], parts: [], step: 1 });
  },

  selectModel: (model) => {
    const { vehicles, brand } = get();
    const years = searchUseCases.deriveVehicleOptions.getYears(vehicles, brand ?? "", model);
    set({ model, year: null, category: null, years, parts: [], step: 2 });
  },

  selectYear: (year) => set({ year, category: null, parts: [], step: 3 }),

  selectCategory: (category) => {
    const { brand, model, year, allParts } = get();
    if (!brand || !year) return;
    try {
      const parts = searchUseCases.getCompatibleParts.execute({
        parts: allParts,
        vehicle: { brand, model: model ?? "", year },
        category,
      });
      set({ category, parts, error: null });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  goTo: (step) => set({ step }),

  reset: () =>
    set({
      step: 0,
      brand: null,
      model: null,
      year: null,
      category: null,
      models: [],
      years: [],
      parts: [],
      error: null,
    }),
}));
