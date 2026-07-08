/**
 * Data · Repository · SearchRepositoryImpl
 * Implementa el contrato del dominio (SearchRepository) delegando en un DataSource
 * y traduciendo DTOs a Entities mediante mappers. La presentación nunca ve un DTO.
 */

import type { Part, PartCategory } from "../../domain/entities/Part";
import type { VehicleSelection } from "../../domain/entities/Vehicle";
import type { SearchRepository } from "../../domain/repositories/SearchRepository";
import { toPartEntities } from "../mappers/partMapper";
import type { SearchRemoteDataSource } from "../datasources/SearchRemoteDataSource";

export class SearchRepositoryImpl implements SearchRepository {
  constructor(private readonly remote: SearchRemoteDataSource) {}

  getBrands(): Promise<string[]> {
    return this.remote.fetchBrands();
  }

  getModels(brand: string): Promise<string[]> {
    return this.remote.fetchModels(brand);
  }

  getYears(brand: string, model: string): Promise<number[]> {
    return this.remote.fetchYears(brand, model);
  }

  async getCompatibleParts(
    vehicle: VehicleSelection,
    category?: PartCategory,
  ): Promise<Part[]> {
    const dtos = await this.remote.fetchParts({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      category,
    });
    return toPartEntities(dtos);
  }
}
