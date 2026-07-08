/**
 * Domain · Use Case · UpdateInventoryStock
 * Valida la regla de negocio (stock no negativo) antes de persistir.
 */

import type { InventoryItem } from "../entities/InventoryItem";
import type { AdminRepository } from "../repositories/AdminRepository";

export class UpdateInventoryStockUseCase {
  constructor(private readonly repository: AdminRepository) {}

  execute(itemId: string, newStock: number): Promise<InventoryItem> {
    if (!Number.isInteger(newStock) || newStock < 0) {
      throw new Error("El stock debe ser un entero mayor o igual a 0.");
    }
    return this.repository.updateStock(itemId, newStock);
  }
}
