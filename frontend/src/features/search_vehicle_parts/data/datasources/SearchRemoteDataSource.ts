/**
 * Data · DataSource · SearchRemoteDataSource
 *
 * Define el origen remoto de datos (API REST / Firebase). El repositorio decide
 * qué datasource usar. Aquí incluimos una implementación MOCK (in-memory) para que
 * el proyecto funcione sin backend, y una implementación HTTP lista para producción.
 */

import type { HttpClient } from "@core/http/HttpClient";
import type { PartDTO } from "../models/PartDTO";

export interface SearchRemoteDataSource {
  fetchBrands(): Promise<string[]>;
  fetchModels(brand: string): Promise<string[]>;
  fetchYears(brand: string, model: string): Promise<number[]>;
  fetchParts(params: {
    brand: string;
    model: string;
    year: number;
    category?: string;
  }): Promise<PartDTO[]>;
}

/* ---------------------------------------------------------------------------
 * Implementación HTTP real (REST). Activar inyectando un HttpClient.
 * ------------------------------------------------------------------------- */
export class SearchHttpDataSource implements SearchRemoteDataSource {
  constructor(private readonly http: HttpClient) {}

  fetchBrands() {
    return this.http.get<string[]>("/vehicles/brands");
  }
  fetchModels(brand: string) {
    return this.http.get<string[]>("/vehicles/models", { params: { brand } });
  }
  fetchYears(brand: string, model: string) {
    return this.http.get<number[]>("/vehicles/years", { params: { brand, model } });
  }
  fetchParts(params: { brand: string; model: string; year: number; category?: string }) {
    return this.http.get<PartDTO[]>("/parts/compatible", { params });
  }
}

/* ---------------------------------------------------------------------------
 * Implementación MOCK (in-memory). Útil en desarrollo / demo sin backend.
 * ------------------------------------------------------------------------- */
const CATALOG: Record<string, Record<string, number[]>> = {
  Nissan: { Versa: [2019, 2020, 2021, 2022], Sentra: [2018, 2020, 2023], March: [2017, 2019] },
  Volkswagen: { Jetta: [2018, 2020, 2022], Vento: [2019, 2021], Gol: [2016, 2018] },
  Toyota: { Corolla: [2019, 2021, 2023], Yaris: [2018, 2020], Hilux: [2020, 2022] },
  Chevrolet: { Aveo: [2017, 2019, 2021], Onix: [2021, 2023], Spark: [2016, 2018] },
};

const MOCK_PARTS: PartDTO[] = [
  { id: "b1", sku: "BAT-35-600", name: "Batería LTH Grupo 35", category: "battery", brand: "LTH", price: 2890, stock: 12, amperage: 600, voltage: 12, bci_group: "Grupo 35" },
  { id: "b2", sku: "BAT-42-700", name: "Batería Bosch S4 Grupo 42", category: "battery", brand: "Bosch", price: 3450, stock: 4, amperage: 700, voltage: 12, bci_group: "Grupo 42" },
  { id: "b3", sku: "BAT-24-650", name: "Batería ACDelco Grupo 24", category: "battery", brand: "ACDelco", price: 3190, stock: 0, amperage: 650, voltage: 12, bci_group: "Grupo 24" },
  { id: "f1", sku: "FUS-MINI-10", name: "Fusible Mini 10A", category: "fuse", brand: "Littelfuse", price: 35, stock: 240, amperage: 10, fuse_type: "Mini", color: "#e23c3c" },
  { id: "f2", sku: "FUS-BLADE-15", name: "Fusible Blade 15A", category: "fuse", brand: "Bosch", price: 28, stock: 180, amperage: 15, fuse_type: "Blade", color: "#3c7be2" },
  { id: "f3", sku: "FUS-MINI-20", name: "Fusible Mini 20A", category: "fuse", brand: "Littelfuse", price: 32, stock: 3, amperage: 20, fuse_type: "Mini", color: "#e2c03c" },
];

const delay = <T>(value: T, ms = 280): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export class SearchMockDataSource implements SearchRemoteDataSource {
  fetchBrands() {
    return delay(Object.keys(CATALOG));
  }
  fetchModels(brand: string) {
    return delay(Object.keys(CATALOG[brand] ?? {}));
  }
  fetchYears(brand: string, model: string) {
    return delay([...(CATALOG[brand]?.[model] ?? [])].sort((a, b) => b - a));
  }
  fetchParts(params: { category?: string }) {
    const filtered = params.category
      ? MOCK_PARTS.filter((p) => p.category === params.category)
      : MOCK_PARTS;
    return delay(filtered);
  }
}
