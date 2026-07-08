/**
 * Data · Repository · CatalogRepositoryImpl
 */

import type { CatalogVehicle } from "../../domain/entities/CatalogVehicle";
import type { CatalogRepository } from "../../domain/repositories/CatalogRepository";
import type { CatalogRemoteDataSource } from "../datasources/CatalogRemoteDataSource";
import { toCatalogVehicle, toCatalogVehicles } from "../mappers/vehicleMapper";

export class CatalogRepositoryImpl implements CatalogRepository {
  constructor(private readonly remote: CatalogRemoteDataSource) {}

  async getAll(): Promise<CatalogVehicle[]> {
    const dtos = await this.remote.fetchAll();
    return toCatalogVehicles(dtos);
  }

  async getFeatured(): Promise<CatalogVehicle[]> {
    const all = await this.getAll();
    return all.filter((v) => v.highlighted).slice(0, 4);
  }

  async getById(id: string): Promise<CatalogVehicle | null> {
    const dto = await this.remote.fetchById(id);
    return dto ? toCatalogVehicle(dto) : null;
  }
}