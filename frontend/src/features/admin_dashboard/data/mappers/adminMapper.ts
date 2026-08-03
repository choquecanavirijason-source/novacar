/**
 * Data · Mapper · adminMapper
 * Funciones puras: DTO (transporte) -> Entity (dominio). Desacoplamiento total.
 */

import type { InventoryItem } from "../../domain/entities/InventoryItem";
import type { InventoryItemDTO } from "../models/InventoryItemDTO";

export const mapInventory = (dto: InventoryItemDTO): InventoryItem => ({
  id: dto.id,
  sku: dto.sku,
  name: dto.name,
  category: dto.category,
  stock: dto.stock,
  price: dto.price,
  reorderLevel: dto.reorder_level,
});
