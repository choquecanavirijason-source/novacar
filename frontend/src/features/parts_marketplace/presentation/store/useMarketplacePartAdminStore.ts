/**
 * Presentation · State (Zustand) · useMarketplacePartAdminStore
 * ViewModel del CRUD de autopartes del marketplace (sub-pestaña "Autopartes"
 * dentro de Inventario, panel admin).
 */

"use client";

import { create } from "zustand";
import type { MarketplacePart, NewMarketplacePart } from "../../domain/entities/MarketplacePart";
import { marketplaceUseCases } from "../../di";

interface MarketplacePartAdminState {
  parts: MarketplacePart[];
  loading: boolean;
  error: string | null;

  load: () => Promise<void>;
  create: (input: NewMarketplacePart) => Promise<boolean>;
  update: (id: string, input: NewMarketplacePart) => Promise<boolean>;
  remove: (id: string) => Promise<void>;
}

export const useMarketplacePartAdminStore = create<MarketplacePartAdminState>((set, get) => ({
  parts: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const parts = await marketplaceUseCases.getAllParts();
      set({ parts, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  create: async (input) => {
    try {
      const created = await marketplaceUseCases.createPart.execute(input);
      set({ parts: [created, ...get().parts] });
      return true;
    } catch (e) {
      set({ error: (e as Error).message });
      return false;
    }
  },

  update: async (id, input) => {
    try {
      const updated = await marketplaceUseCases.updatePart.execute(id, input);
      set({ parts: get().parts.map((p) => (p.id === id ? updated : p)) });
      return true;
    } catch (e) {
      set({ error: (e as Error).message });
      return false;
    }
  },

  remove: async (id) => {
    try {
      await marketplaceUseCases.deletePart.execute(id);
      set({ parts: get().parts.filter((p) => p.id !== id) });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));
