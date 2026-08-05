/**
 * Data · DataSource · QuoteRequestRemoteDataSource (HTTP + MOCK)
 * El MOCK persiste en localStorage: mientras no haya backend, las cotizaciones
 * que envía el sitio público sobreviven a recargas de página en este navegador.
 */

import { createApiClient } from "@core/http/createApiClient";
import { getAuthToken } from "@core/auth/token";
import type { HttpClient } from "@core/http/HttpClient";
import type { NewQuoteRequest, QuoteRequest, QuoteStatus } from "../../domain/entities/QuoteRequest";
import type { QuoteRequestDTO } from "../models/QuoteRequestDTO";
import { mapQuoteRequest, toQuoteRequestPayload } from "../mappers/quoteRequestMapper";

export interface QuoteRequestRemoteDataSource {
  fetchAll(): Promise<QuoteRequest[]>;
  create(input: NewQuoteRequest): Promise<QuoteRequest>;
  updateStatus(id: string, status: QuoteStatus): Promise<QuoteRequest>;
  remove(id: string): Promise<void>;
}

/* ---- Implementación HTTP real (backend Laravel) ---- */
export class QuoteRequestHttpDataSource implements QuoteRequestRemoteDataSource {
  constructor(private readonly clientFactory: () => HttpClient = () => createApiClient(getAuthToken())) {}

  private http() {
    return this.clientFactory();
  }

  async fetchAll() {
    const dtos = await this.http().get<QuoteRequestDTO[]>("/admin/quote-requests");
    return dtos.map(mapQuoteRequest);
  }

  async create(input: NewQuoteRequest) {
    const dto = await this.http().post<QuoteRequestDTO>("/quote-requests", toQuoteRequestPayload(input));
    return mapQuoteRequest(dto);
  }

  async updateStatus(id: string, status: QuoteStatus) {
    const dto = await this.http().patch<QuoteRequestDTO>(`/admin/quote-requests/${id}/status`, { status });
    return mapQuoteRequest(dto);
  }

  async remove(id: string) {
    await this.http().delete(`/admin/quote-requests/${id}`);
  }
}

/* ---- Implementación MOCK (persistida en localStorage) ---- */
const STORAGE_KEY = "novacar.quote_requests";

const SEED: QuoteRequest[] = [
  {
    id: "seed-1",
    source: "import",
    customerEmail: "cliente.demo@example.com",
    subject: "Toyota Corolla 2020",
    details: "Base: $185,000 · Impuestos: $29,600 · Flete: $25,000 · Total: $239,600",
    amount: 239600,
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "seed-2",
    source: "inquiry",
    customerEmail: "otro.demo@example.com",
    subject: "Batería BCI 35 — 600 CCA",
    details: "Solicita disponibilidad, precio final y compatibilidad.",
    amount: null,
    status: "contacted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

function readStore(): QuoteRequest[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as QuoteRequest[];
  } catch {
    return SEED;
  }
}

function writeStore(requests: QuoteRequest[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

const delay = <T>(value: T, ms = 200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export class QuoteRequestMockDataSource implements QuoteRequestRemoteDataSource {
  fetchAll() {
    return delay([...readStore()]);
  }

  create(input: NewQuoteRequest) {
    const requests = readStore();
    const request: QuoteRequest = {
      ...input,
      id: `qr-${Date.now()}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    writeStore([...requests, request]);
    return delay(request);
  }

  updateStatus(id: string, status: QuoteStatus) {
    const requests = readStore();
    const current = requests.find((r) => r.id === id);
    if (!current) return Promise.reject(new Error("Cotización no encontrada."));
    const updated = { ...current, status };
    writeStore(requests.map((r) => (r.id === id ? updated : r)));
    return delay(updated);
  }

  remove(id: string) {
    writeStore(readStore().filter((r) => r.id !== id));
    return delay(undefined);
  }
}
