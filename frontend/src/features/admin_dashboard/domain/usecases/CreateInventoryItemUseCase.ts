/**
 * Domain · Use Case · CreateInventoryItem
 * Alta de una pieza/vehículo nuevo en inventario. Valida reglas de negocio
 * mínimas (precio y stock no negativos) antes de persistir.
 */

import type { InventoryItem, NewInventoryItem } from "../entities/InventoryItem";
import type { AdminRepository } from "../repositories/AdminRepository";

export class CreateInventoryItemUseCase {
  constructor(private readonly repository: AdminRepository) {}

  execute(input: NewInventoryItem): Promise<InventoryItem> {
    if (!input.name.trim()) {
      throw new Error("El nombre es obligatorio.");
    }
    if (!Number.isInteger(input.stock) || input.stock < 0) {
      throw new Error("El stock debe ser un entero mayor o igual a 0.");
    }
    if (input.price <= 0) {
      throw new Error("El precio debe ser mayor a 0.");
    }
    return this.repository.createInventoryItem(input);
  }
}
