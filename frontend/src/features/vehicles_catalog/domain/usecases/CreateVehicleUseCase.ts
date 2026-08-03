/**
 * Domain · Use Case · CreateVehicle
 * Alta de un auto nuevo en el catálogo. Valida campos mínimos antes de persistir.
 */

import type { CatalogVehicle, NewCatalogVehicle } from "../entities/CatalogVehicle";
import type { CatalogRepository } from "../repositories/CatalogRepository";

export class CreateVehicleUseCase {
  constructor(private readonly repository: CatalogRepository) {}

  execute(input: NewCatalogVehicle): Promise<CatalogVehicle> {
    if (!input.brand.trim() || !input.model.trim()) {
      throw new Error("Marca y modelo son obligatorios.");
    }
    if (input.price <= 0) {
      throw new Error("El precio debe ser mayor a 0.");
    }
    if (input.year < 1980 || input.year > new Date().getFullYear() + 1) {
      throw new Error("El año no es válido.");
    }
    return this.repository.createVehicle(input);
  }
}
