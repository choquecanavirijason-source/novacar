/**
 * Data · DataSource · BannerRemoteDataSource (HTTP + MOCK)
 * El MOCK persiste en localStorage: mientras no haya backend, los banners
 * que crea el admin sobreviven a recargas de página en este navegador.
 */

import { createApiClient } from "@core/http/createApiClient";
import { getAuthToken } from "@core/auth/token";
import type { HttpClient } from "@core/http/HttpClient";
import type { Banner, NewBanner } from "../../domain/entities/Banner";
import type { BannerDTO } from "../models/BannerDTO";
import { mapBanner, toBannerPayload } from "../mappers/bannerMapper";

export interface BannerRemoteDataSource {
  fetchAll(): Promise<Banner[]>;
  fetchActive(): Promise<Banner[]>;
  create(input: NewBanner): Promise<Banner>;
  update(id: string, input: NewBanner): Promise<Banner>;
  toggleActive(id: string, active: boolean): Promise<Banner>;
  remove(id: string): Promise<void>;
  reorder(orderedIds: string[]): Promise<Banner[]>;
}

/* ---- Implementación HTTP real (backend Laravel) ---- */
export class BannerHttpDataSource implements BannerRemoteDataSource {
  constructor(private readonly clientFactory: () => HttpClient = () => createApiClient(getAuthToken())) {}

  private http() {
    return this.clientFactory();
  }

  async fetchAll() {
    const dtos = await this.http().get<BannerDTO[]>("/admin/banners");
    return dtos.map(mapBanner);
  }

  async fetchActive() {
    const dtos = await this.http().get<BannerDTO[]>("/banners");
    return dtos.map(mapBanner);
  }

  async create(input: NewBanner) {
    const dto = await this.http().post<BannerDTO>("/admin/banners", toBannerPayload(input));
    return mapBanner(dto);
  }

  async update(id: string, input: NewBanner) {
    const dto = await this.http().put<BannerDTO>(`/admin/banners/${id}`, toBannerPayload(input));
    return mapBanner(dto);
  }

  async toggleActive(id: string, active: boolean) {
    const dto = await this.http().patch<BannerDTO>(`/admin/banners/${id}/active`, { active });
    return mapBanner(dto);
  }

  async remove(id: string) {
    await this.http().delete(`/admin/banners/${id}`);
  }

  async reorder(orderedIds: string[]) {
    const dtos = await this.http().patch<BannerDTO[]>("/admin/banners/reorder", { ordered_ids: orderedIds });
    return dtos.map(mapBanner);
  }
}

/* ---- Implementación MOCK (persistida en localStorage) ---- */
const STORAGE_KEY = "novacar.banners";

const SEED: Banner[] = [
  {
    id: "seed-1",
    title: "Autopartes con envío gratis",
    subtitle: "En baterías y llantas seleccionadas, todo el mes.",
    imageUrl: "/car-azul-hero.png",
    ctaLabel: "Ver autopartes",
    href: "/autopartes",
    accentFrom: "#005f8f",
    accentTo: "#00aaff",
    active: true,
    order: 0,
  },
  {
    id: "seed-2",
    title: "Autos seminuevos certificados",
    subtitle: "Revisión de 120 puntos y garantía incluida.",
    imageUrl: "/car-azul-hero.png",
    ctaLabel: "Ver catálogo",
    href: "/catalogo",
    accentFrom: "#0077b3",
    accentTo: "#4dc4ff",
    active: true,
    order: 1,
  },
];

function readStore(): Banner[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as Banner[];
  } catch {
    return SEED;
  }
}

function writeStore(banners: Banner[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(banners));
}

const delay = <T>(value: T, ms = 200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export class BannerMockDataSource implements BannerRemoteDataSource {
  fetchAll() {
    return delay([...readStore()].sort((a, b) => a.order - b.order));
  }

  fetchActive() {
    return delay(
      readStore()
        .filter((b) => b.active)
        .sort((a, b) => a.order - b.order),
    );
  }

  create(input: NewBanner) {
    const banners = readStore();
    const banner: Banner = {
      ...input,
      id: `bn-${Date.now()}`,
      order: banners.length,
    };
    writeStore([...banners, banner]);
    return delay(banner);
  }

  update(id: string, input: NewBanner) {
    const banners = readStore();
    const current = banners.find((b) => b.id === id);
    if (!current) return Promise.reject(new Error("Banner no encontrado."));
    const updated: Banner = { ...current, ...input };
    writeStore(banners.map((b) => (b.id === id ? updated : b)));
    return delay(updated);
  }

  toggleActive(id: string, active: boolean) {
    const banners = readStore();
    const current = banners.find((b) => b.id === id);
    if (!current) return Promise.reject(new Error("Banner no encontrado."));
    const updated = { ...current, active };
    writeStore(banners.map((b) => (b.id === id ? updated : b)));
    return delay(updated);
  }

  remove(id: string) {
    writeStore(readStore().filter((b) => b.id !== id));
    return delay(undefined);
  }

  reorder(orderedIds: string[]) {
    const banners = readStore();
    const reordered = orderedIds
      .map((id, index) => {
        const banner = banners.find((b) => b.id === id);
        return banner ? { ...banner, order: index } : null;
      })
      .filter((b): b is Banner => b !== null);
    writeStore(reordered);
    return delay(reordered);
  }
}
