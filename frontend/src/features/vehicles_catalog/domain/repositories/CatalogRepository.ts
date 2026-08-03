/**
 * Domain · Repository Contract · CatalogRepository
 */

import type { CatalogVehicle, NewCatalogVehicle } from "../entities/CatalogVehicle";

export interface CatalogRepository {
  getAll(): Promise<CatalogVehicle[]>;
  getFeatured(): Promise<CatalogVehicle[]>;
  getById(id: string): Promise<CatalogVehicle | null>;
  createVehicle(input: NewCatalogVehicle): Promise<CatalogVehicle>;
  updateVehicle(id: string, input: NewCatalogVehicle): Promise<CatalogVehicle>;
  deleteVehicle(id: string): Promise<void>;
}
