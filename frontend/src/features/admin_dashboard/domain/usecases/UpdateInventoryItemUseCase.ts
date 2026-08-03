/**
 * Domain · Use Case · UpdateInventoryItem
 */

import type { InventoryItem, NewInventoryItem } from "../entities/InventoryItem";
import type { AdminRepository } from "../repositories/AdminRepository";

export class UpdateInventoryItemUseCase {
  constructor(private readonly repository: AdminRepository) {}

  execute(itemId: string, input: NewInventoryItem): Promise<InventoryItem> {
    if (!input.name.trim()) {
      throw new Error("El nombre es obligatorio.");
    }
    if (!Number.isInteger(input.stock) || input.stock < 0) {
      throw new Error("El stock debe ser un entero mayor o igual a 0.");
    }
    if (input.price <= 0) {
      throw new Error("El precio debe ser mayor a 0.");
    }
    return this.repository.updateInventoryItem(itemId, input);
  }
}
