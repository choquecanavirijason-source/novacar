/**
 * Presentation · State (Zustand) · useQuoteRequestStore
 * ViewModel del módulo de cotizaciones: usado por el panel admin (bandeja +
 * cambio de estado) y por los formularios públicos que las generan
 * (ImportQuoteModal, ProductInquiryModal).
 */

"use client";

import { create } from "zustand";
import type { NewQuoteRequest, QuoteStatus, QuoteRequest } from "../../domain/entities/QuoteRequest";
import { quoteRequestUseCases } from "../../di";

interface QuoteRequestState {
  requests: QuoteRequest[];
  loading: boolean;
  error: string | null;

  load: () => Promise<void>;
  create: (input: NewQuoteRequest) => Promise<boolean>;
  updateStatus: (id: string, status: QuoteStatus) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useQuoteRequestStore = create<QuoteRequestState>((set, get) => ({
  requests: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const requests = await quoteRequestUseCases.getQuoteRequests.execute();
      set({ requests, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  create: async (input) => {
    try {
      await quoteRequestUseCases.createQuoteRequest.execute(input);
      return true;
    } catch (e) {
      set({ error: (e as Error).message });
      return false;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const updated = await quoteRequestUseCases.updateQuoteRequestStatus.execute(id, status);
      set({ requests: get().requests.map((r) => (r.id === id ? updated : r)) });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  remove: async (id) => {
    try {
      await quoteRequestUseCases.deleteQuoteRequest.execute(id);
      set({ requests: get().requests.filter((r) => r.id !== id) });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },
}));
