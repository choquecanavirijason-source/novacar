/**
 * Domain · Use Case · UpdateVehicle
 */

import type { CatalogVehicle, NewCatalogVehicle } from "../entities/CatalogVehicle";
import type { CatalogRepository } from "../repositories/CatalogRepository";

export class UpdateVehicleUseCase {
  constructor(private readonly repository: CatalogRepository) {}

  execute(id: string, input: NewCatalogVehicle): Promise<CatalogVehicle> {
    if (!input.brand.trim() || !input.model.trim()) {
      throw new Error("Marca y modelo son obligatorios.");
    }
    if (input.price <= 0) {
      throw new Error("El precio debe ser mayor a 0.");
    }
    return this.repository.updateVehicle(id, input);
  }
}
