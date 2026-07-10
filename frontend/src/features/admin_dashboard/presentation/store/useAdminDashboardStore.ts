/**
 * Presentation · State (Zustand) · useAdminDashboardStore
 * ViewModel del panel: carga analíticas/inventario e invoca los use cases.
 */

"use client";

import { create } from "zustand";
import type { AnalyticsSummary } from "../../domain/entities/DashboardStats";
import type { InventoryItem, NewInventoryItem } from "../../domain/entities/InventoryItem";
import { adminUseCases } from "../../di";

interface AdminDashboardState {
  summary: AnalyticsSummary | null;
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;

  load: () => Promise<void>;
  updateStock: (itemId: string, newStock: number) => Promise<void>;
  addItem: (input: NewInventoryItem) => Promise<boolean>;
}

export const useAdminDashboardStore = create<AdminDashboardState>((set, get) => ({
  summary: null,
  inventory: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const [summary, inventory] = await Promise.all([
        adminUseCases.getAnalyticsSummary.execute(),
        adminUseCases.getInventory(),
      ]);
      set({ summary, inventory, loading: false });
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
}));
