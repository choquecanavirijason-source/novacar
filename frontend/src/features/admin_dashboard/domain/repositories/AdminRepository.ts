/**
 * Domain · Repository Contract · AdminRepository
 */

import type { AnalyticsSummary } from "../entities/DashboardStats";
import type { InventoryItem, NewInventoryItem } from "../entities/InventoryItem";

export interface AdminRepository {
  getInventory(): Promise<InventoryItem[]>;
  getAnalyticsSummary(): Promise<AnalyticsSummary>;
  updateStock(itemId: string, newStock: number): Promise<InventoryItem>;
  createInventoryItem(input: NewInventoryItem): Promise<InventoryItem>;
}
