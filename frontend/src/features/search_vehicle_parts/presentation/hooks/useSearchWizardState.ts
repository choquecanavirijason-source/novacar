/**
 * Presentation · State (Zustand) · useSearchWizardState
 *
 * ViewModel del buscador por pasos. Mantiene el estado de la UI e invoca los
 * Use Cases del dominio (vía el composition root `di.ts`). No contiene lógica
 * de negocio ni accede a datos directamente.
 */

"use client";

import { create } from "zustand";
import type { Part, PartCategory } from "../../domain/entities/Part";
import { searchUseCases } from "../../di";

export type WizardStep = 0 | 1 | 2 | 3; // marca, modelo, año, categoría

interface SearchWizardState {
  // selección
  step: WizardStep;
  brand: string | null;
  model: string | null;
  year: number | null;
  category: PartCategory | null;

  // opciones cargadas reactivamente
  brands: string[];
  models: string[];
  years: number[];

  // resultados
  parts: Part[];
  loading: boolean;
  error: string | null;

  // acciones
  init: () => Promise<void>;
  selectBrand: (brand: string) => Promise<void>;
  selectModel: (model: string) => Promise<void>;
  selectYear: (year: number) => void;
  selectCategory: (category: PartCategory) => Promise<void>;
  goTo: (step: WizardStep) => void;
  reset: () => void;
}

export const useSearchWizardState = create<SearchWizardState>((set, get) => ({
  step: 0,
  brand: null,
  model: null,
  year: null,
  category: null,
  brands: [],
  models: [],
  years: [],
  parts: [],
  loading: false,
  error: null,

  init: async () => {
    set({ loading: true, error: null });
    try {
      const brands = await searchUseCases.getVehicleOptions.getBrands();
      set({ brands, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  selectBrand: async (brand) => {
    set({ brand, model: null, year: null, category: null, models: [], years: [], parts: [], loading: true });
    try {
      const models = await searchUseCases.getVehicleOptions.getModels(brand);
      set({ models, step: 1, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  selectModel: async (model) => {
    const { brand } = get();
    set({ model, year: null, category: null, years: [], parts: [], loading: true });
    try {
      const years = await searchUseCases.getVehicleOptions.getYears(brand!, model);
      set({ years, step: 2, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  selectYear: (year) => set({ year, category: null, parts: [], step: 3 }),

  selectCategory: async (category) => {
    const { brand, model, year } = get();
    if (!brand || !model || !year) return;
    set({ category, loading: true, error: null });
    try {
      const result = await searchUseCases.getCompatibleParts.execute({
        vehicle: { brand, model, year },
        category,
      });
      set({ parts: [...result.compatibleParts], loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
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
