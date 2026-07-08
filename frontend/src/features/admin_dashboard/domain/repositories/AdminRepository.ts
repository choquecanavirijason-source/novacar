/**
 * Domain · Repository Contract · AdminRepository
 */

import type { AnalyticsSummary } from "../entities/DashboardStats";
import type { InventoryItem } from "../entities/InventoryItem";

export interface AdminRepository {
  getInventory(): Promise<InventoryItem[]>;
  getAnalyticsSummary(): Promise<AnalyticsSummary>;
  updateStock(itemId: string, newStock: number): Promise<InventoryItem>;
}
