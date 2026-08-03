/**
 * Data · DataSource · AdminRemoteDataSource (HTTP + MOCK)
 * El MOCK persiste en localStorage: mismo patrón que site_banners y
 * vehicles_catalog, así lo que el admin crea/edita/borra sobrevive a recargas.
 */

import { createApiClient } from "@core/http/createApiClient";
import { getAuthToken } from "@core/auth/token";
import type { HttpClient } from "@core/http/HttpClient";
import type { InventoryItem, NewInventoryItem } from "../../domain/entities/InventoryItem";
import type { InventoryItemDTO } from "../models/InventoryItemDTO";
import { mapInventory } from "../mappers/adminMapper";

export interface AdminRemoteDataSource {
  fetchInventory(): Promise<InventoryItem[]>;
  patchStock(itemId: string, newStock: number): Promise<InventoryItem>;
  createItem(input: NewInventoryItem): Promise<InventoryItem>;
  updateItem(itemId: string, input: NewInventoryItem): Promise<InventoryItem>;
  removeItem(itemId: string): Promise<void>;
}

export class AdminHttpDataSource implements AdminRemoteDataSource {
  constructor(private readonly clientFactory: () => HttpClient = () => createApiClient(getAuthToken())) {}

  private http() {
    return this.clientFactory();
  }

  async fetchInventory() {
    const dtos = await this.http().get<InventoryItemDTO[]>("/admin/inventory");
    return dtos.map(mapInventory);
  }

  async patchStock(itemId: string, newStock: number) {
    const dto = await this.http().patch<InventoryItemDTO>(`/admin/inventory/${itemId}/stock`, {
      stock: newStock,
    });
    return mapInventory(dto);
  }

  async createItem(input: NewInventoryItem) {
    const dto = await this.http().post<InventoryItemDTO>("/admin/inventory", {
      name: input.name,
      category: input.category,
      stock: input.stock,
      price: input.price,
      reorder_level: input.reorderLevel,
    });
    return mapInventory(dto);
  }

  async updateItem(itemId: string, input: NewInventoryItem) {
    const dto = await this.http().put<InventoryItemDTO>(`/admin/inventory/${itemId}`, {
      name: input.name,
      category: input.category,
      stock: input.stock,
      price: input.price,
      reorder_level: input.reorderLevel,
    });
    return mapInventory(dto);
  }

  removeItem(itemId: string) {
    return this.http().delete<void>(`/admin/inventory/${itemId}`);
  }
}

const SEED: InventoryItem[] = [
  { id: "b1", sku: "BAT-35-600", name: "Batería LTH Grupo 35", category: "battery", stock: 12, price: 2890, reorderLevel: 5 },
  { id: "b2", sku: "BAT-42-700", name: "Batería Bosch S4 Grupo 42", category: "battery", stock: 4, price: 3450, reorderLevel: 5 },
  { id: "f1", sku: "FUS-MINI-10", name: "Fusible Mini 10A", category: "fuse", stock: 240, price: 35, reorderLevel: 50 },
  { id: "f3", sku: "FUS-MINI-20", name: "Fusible Mini 20A", category: "fuse", stock: 3, price: 32, reorderLevel: 50 },
];

const STORAGE_KEY = "novacar.inventory";

function readStore(): InventoryItem[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as InventoryItem[];
  } catch {
    return SEED;
  }
}

function writeStore(items: InventoryItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const delay = <T>(value: T, ms = 220): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export class AdminMockDataSource implements AdminRemoteDataSource {
  fetchInventory() {
    return delay([...readStore()]);
  }

  patchStock(itemId: string, newStock: number): Promise<InventoryItem> {
    const items = readStore();
    const updated = items.find((i) => i.id === itemId);
    if (!updated) return Promise.reject(new Error("Ítem no encontrado."));
    const next = { ...updated, stock: newStock };
    writeStore(items.map((i) => (i.id === itemId ? next : i)));
    return delay(next);
  }

  createItem(input: NewInventoryItem): Promise<InventoryItem> {
    const items = readStore();
    const knownPrefix: Record<string, string> = { battery: "BAT", fuse: "FUS" };
    const prefix = knownPrefix[input.category] ?? input.category.slice(0, 3).toUpperCase();
    const item: InventoryItem = {
      id: `${prefix.toLowerCase()}-${Date.now()}`,
      sku: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...input,
    };
    writeStore([item, ...items]);
    return delay(item);
  }

  updateItem(itemId: string, input: NewInventoryItem): Promise<InventoryItem> {
    const items = readStore();
    const current = items.find((i) => i.id === itemId);
    if (!current) return Promise.reject(new Error("Ítem no encontrado."));
    const updated: InventoryItem = { ...current, ...input };
    writeStore(items.map((i) => (i.id === itemId ? updated : i)));
    return delay(updated);
  }

  removeItem(itemId: string): Promise<void> {
    writeStore(readStore().filter((i) => i.id !== itemId));
    return delay(undefined);
  }
}
