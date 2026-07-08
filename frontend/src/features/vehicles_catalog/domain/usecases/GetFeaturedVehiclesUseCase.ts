/**
 * Domain · Use Case · GetFeaturedVehicles
 */

import type { CatalogVehicle } from "../entities/CatalogVehicle";
import type { CatalogRepository } from "../repositories/CatalogRepository";

export class GetFeaturedVehiclesUseCase {
  constructor(private readonly repository: CatalogRepository) {}

  execute(): Promise<CatalogVehicle[]> {
    return this.repository.getFeatured();
  }
}
