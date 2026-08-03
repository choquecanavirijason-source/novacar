/**
 * Presentation · State (Zustand) · useBannerStore
 * ViewModel del módulo de banners: usado tanto por el panel admin (CRUD
 * completo) como por el sitio público (solo lectura de activos).
 */

"use client";

import { create } from "zustand";
import type { Banner, NewBanner } from "../../domain/entities/Banner";
import { bannerUseCases } from "../../di";

interface BannerState {
  banners: Banner[];
  loading: boolean;
  error: string | null;

  loadAll: () => Promise<void>;
  loadActive: () => Promise<void>;
  create: (input: NewBanner) => Promise<boolean>;
  update: (id: string, input: NewBanner) => Promise<boolean>;
  remove: (id: string) => Promise<void>;
  toggleActive: (id: string, active: boolean) => Promise<void>;
  moveUp: (id: string) => Promise<void>;
  moveDown: (id: string) => Promise<void>;
}

export const useBannerStore = create<BannerState>((set, get) => ({
  banners: [],
  loading: false,
  error: null,

  loadAll: async () => {
    set({ loading: true, error: null });
    try {
      const banners = await bannerUseCases.getBanners.execute();
      set({ banners, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  loadActive: async () => {
    set({ loading: true, error: null });
    try {
      const banners = await bannerUseCases.getActiveBanners.execute();
      set({ banners, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  create: async (input) => {
    try {
      const created = await bannerUseCases.createBanner.execute(input);
      set({ banners: [...get().banners, created].sort((a, b) => a.order - b.order) });
      return true;
    } catch (e) {
      set({ error: (e as Error).message });
      return false;
    }
  },

  update: async (id, input) => {
    try {
      const updated = await bannerUseCases.updateBanner.execute(id, input);
      set({ banners: get().banners.map((b) => (b.id === id ? updated : b)) });
      return true;
    } catch (e) {
      set({ error: (e as Error).message });
      return false;
    }
  },

  remove: async (id) => {
    try {
      await bannerUseCases.deleteBanner.execute(id);
      set({ banners: get().banners.filter((b) => b.id !== id) });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  toggleActive: async (id, active) => {
    try {
      const updated = await bannerUseCases.toggleBannerActive.execute(id, active);
      set({ banners: get().banners.map((b) => (b.id === id ? updated : b)) });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  moveUp: async (id) => {
    const ordered = [...get().banners].sort((a, b) => a.order - b.order);
    const index = ordered.findIndex((b) => b.id === id);
    if (index <= 0) return;
    [ordered[index - 1], ordered[index]] = [ordered[index], ordered[index - 1]];
    const reordered = await bannerUseCases.reorderBanners.execute(ordered.map((b) => b.id));
    set({ banners: reordered });
  },

  moveDown: async (id) => {
    const ordered = [...get().banners].sort((a, b) => a.order - b.order);
    const index = ordered.findIndex((b) => b.id === id);
    if (index === -1 || index >= ordered.length - 1) return;
    [ordered[index], ordered[index + 1]] = [ordered[index + 1], ordered[index]];
    const reordered = await bannerUseCases.reorderBanners.execute(ordered.map((b) => b.id));
    set({ banners: reordered });
  },
}));
