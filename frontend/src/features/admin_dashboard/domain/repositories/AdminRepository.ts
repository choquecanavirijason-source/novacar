/**
 * Domain · Repository Contract · AdminRepository
 */

import type { InventoryItem, NewInventoryItem } from "../entities/InventoryItem";

export interface AdminRepository {
  getInventory(): Promise<InventoryItem[]>;
  updateStock(itemId: string, newStock: number): Promise<InventoryItem>;
  createInventoryItem(input: NewInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(itemId: string, input: NewInventoryItem): Promise<InventoryItem>;
  deleteInventoryItem(itemId: string): Promise<void>;
}
