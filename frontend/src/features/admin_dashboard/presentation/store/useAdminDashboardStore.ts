/**
 * Presentation · State (Zustand) · useAdminDashboardStore
 * ViewModel del panel: carga inventario e invoca los use cases. Las
 * analíticas del panel (AnalyticsPage) se agregan del lado del cliente a
 * partir de los datos reales de este store + vehicles_catalog +
 * parts_marketplace + site_banners, no de un endpoint de "resumen" aparte.
 */

"use client";

import { create } from "zustand";
import type { InventoryItem, NewInventoryItem } from "../../domain/entities/InventoryItem";
import { adminUseCases } from "../../di";

interface AdminDashboardState {
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;

  load: () => Promise<void>;
  updateStock: (itemId: string, newStock: number) => Promise<void>;
  addItem: (input: NewInventoryItem) => Promise<boolean>;
  updateItem: (itemId: string, input: NewInventoryItem) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<void>;
}

export const useAdminDashboardStore = create<AdminDashboardState>((set, get) => ({
  inventory: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const inventory = await adminUseCases.getInventory();
      set({ inventory, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  updateStock: async (itemId, newStock) => {
    try {
      const updated = await adminUseCases.updateInventoryStock.execute(itemId, newStock);
      set({
        inventory: get().inventory.map((i) => (i.id === itemId ? updated : i)),
      });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  addItem: async (input) => {
    try {
      const created = await adminUseCases.createInventoryItem.execute(input);
      set({ inventory: [created, ...get().inventory] });
      return true;
    } catch (e) {
      set({ error: (e as Error).message });
      return false;
    }
  },

  updateItem: async (itemId, input) => {
    try {
      const updated = await adminUseCases.updateInventoryItem.execute(itemId, input);
      set({ inventory: get().inventory.map((i) => (i.id === itemId ? updated : i)) });
      return true;
    } catch (e) {
      set({ error: (e as Error).message });
      return false;
    }
  },

  removeItem: async (itemId) => {
    try {
      await adminUseCases.deleteInventoryItem.execute(itemId);
      set({ inventory: get().inventory.filter((i) => i.id !== itemId) });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));
