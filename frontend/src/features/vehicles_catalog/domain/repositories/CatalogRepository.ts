/**
 * Domain · Repository Contract · CatalogRepository
 */

import type { CatalogVehicle } from "../entities/CatalogVehicle";

export interface CatalogRepository {
  getAll(): Promise<CatalogVehicle[]>;
  getFeatured(): Promise<CatalogVehicle[]>;
  getById(id: string): Promise<CatalogVehicle | null>;
}
