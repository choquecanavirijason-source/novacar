/**
 * Domain · Use Case · GetVehicleById
 */

import type { CatalogVehicle } from "../entities/CatalogVehicle";
import type { CatalogRepository } from "../repositories/CatalogRepository";

export class GetVehicleByIdUseCase {
  constructor(private readonly repository: CatalogRepository) {}

  execute(id: string): Promise<CatalogVehicle | null> {
    if (!id) return Promise.resolve(null);
    return this.repository.getById(id);
  }
}
