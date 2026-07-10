/**
 * Data · Repository · AdminRepositoryImpl
 */

import type { AnalyticsSummary } from "../../domain/entities/DashboardStats";
import type { InventoryItem, NewInventoryItem } from "../../domain/entities/InventoryItem";
import type { AdminRepository } from "../../domain/repositories/AdminRepository";
import type { AdminRemoteDataSource } from "../datasources/AdminRemoteDataSource";

export class AdminRepositoryImpl implements AdminRepository {
  constructor(private readonly remote: AdminRemoteDataSource) {}

  getInventory(): Promise<InventoryItem[]> {
    return this.remote.fetchInventory();
  }

  getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return this.remote.fetchAnalytics();
  }

  updateStock(itemId: string, newStock: number): Promise<InventoryItem> {
    return this.remote.patchStock(itemId, newStock);
  }

  createInventoryItem(input: NewInventoryItem): Promise<InventoryItem> {
    return this.remote.createItem(input);
  }
}
