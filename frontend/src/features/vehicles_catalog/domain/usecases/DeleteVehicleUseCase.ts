/**
 * Domain · Use Case · DeleteVehicle
 */

import type { CatalogRepository } from "../repositories/CatalogRepository";

export class DeleteVehicleUseCase {
  constructor(private readonly repository: CatalogRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.deleteVehicle(id);
  }
}
