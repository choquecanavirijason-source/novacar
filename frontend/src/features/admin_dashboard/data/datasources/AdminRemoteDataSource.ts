/**
 * Data · DataSource · AdminRemoteDataSource (HTTP + MOCK)
 */

import { createApiClient } from "@core/http/createApiClient";
import { getAuthToken } from "@core/auth/token";
import type { HttpClient } from "@core/http/HttpClient";
import type { AnalyticsSummary } from "../../domain/entities/DashboardStats";
import type { InventoryItem, NewInventoryItem } from "../../domain/entities/InventoryItem";
import type { InventoryItemDTO } from "../models/InventoryItemDTO";
import type { AnalyticsSummaryDTO } from "../models/AnalyticsSummaryDTO";
import { mapInventory, mapAnalytics } from "../mappers/adminMapper";

export interface AdminRemoteDataSource {
  fetchInventory(): Promise<InventoryItem[]>;
  fetchAnalytics(): Promise<AnalyticsSummary>;
  patchStock(itemId: string, newStock: number): Promise<InventoryItem>;
  createItem(input: NewInventoryItem): Promise<InventoryItem>;
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

  async fetchAnalytics() {
    const dto = await this.http().get<AnalyticsSummaryDTO>("/admin/analytics");
    return mapAnalytics(dto);
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
}

const delay = <T>(value: T, ms = 260): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

let INVENTORY: InventoryItem[] = [
  { id: "v1", sku: "VH-VERSA-21", name: "Nissan Versa Sense 2021", category: "vehicle", stock: 6, price: 289000, reorderLevel: 2 },
  { id: "v2", sku: "VH-JETTA-22", name: "VW Jetta Trendline 2022", category: "vehicle", stock: 1, price: 410000, reorderLevel: 2 },
  { id: "b1", sku: "BAT-35-600", name: "Batería LTH Grupo 35", category: "battery", stock: 12, price: 2890, reorderLevel: 5 },
  { id: "b2", sku: "BAT-42-700", name: "Batería Bosch S4 Grupo 42", category: "battery", stock: 4, price: 3450, reorderLevel: 5 },
  { id: "f1", sku: "FUS-MINI-10", name: "Fusible Mini 10A", category: "fuse", stock: 240, price: 35, reorderLevel: 50 },
  { id: "f3", sku: "FUS-MINI-20", name: "Fusible Mini 20A", category: "fuse", stock: 3, price: 32, reorderLevel: 50 },
];

export class AdminMockDataSource implements AdminRemoteDataSource {
  fetchInventory() {
    return delay([...INVENTORY]);
  }

  fetchAnalytics(): Promise<AnalyticsSummary> {
    const lowStockCount = INVENTORY.filter((i) => i.stock <= i.reorderLevel).length;
    return delay({
      stats: {
        totalVehicles: INVENTORY.filter((i) => i.category === "vehicle").length,
        totalParts: INVENTORY.filter((i) => i.category !== "vehicle").length,
        lowStockCount,
        monthlyRevenue: 1_284_500,
      },
      topSellingParts: [
        { name: "Batería LTH Grupo 35", units: 84 },
        { name: "Fusible Mini 10A", units: 530 },
        { name: "Batería Bosch S4 Grupo 42", units: 41 },
      ],
    });
  }

  patchStock(itemId: string, newStock: number): Promise<InventoryItem> {
    INVENTORY = INVENTORY.map((i) => (i.id === itemId ? { ...i, stock: newStock } : i));
    const updated = INVENTORY.find((i) => i.id === itemId);
    if (!updated) return Promise.reject(new Error("Ítem no encontrado."));
    return delay(updated);
  }

  createItem(input: NewInventoryItem): Promise<InventoryItem> {
    const prefix = input.category === "vehicle" ? "VH" : input.category === "battery" ? "BAT" : "FUS";
    const item: InventoryItem = {
      id: `${prefix.toLowerCase()}-${Date.now()}`,
      sku: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...input,
    };
    INVENTORY = [item, ...INVENTORY];
    return delay(item);
  }
}
