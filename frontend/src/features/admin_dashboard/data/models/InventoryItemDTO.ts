/**
 * Data · Model · InventoryItemDTO
 */

import type { InventoryItem } from "../../domain/entities/InventoryItem";

export interface InventoryItemDTO {
  id: string;
  sku: string;
  name: string;
  category: InventoryItem["category"];
  stock: number;
  price: number;
  reorder_level: number;
}
