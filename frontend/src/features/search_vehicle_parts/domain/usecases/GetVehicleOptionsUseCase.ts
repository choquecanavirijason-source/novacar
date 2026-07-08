/**
 * Domain · Use Case · GetVehicleOptions
 * Alimenta el buscador por pasos: marcas → modelos → años de forma reactiva.
 */

import type { SearchRepository } from "../repositories/SearchRepository";

export class GetVehicleOptionsUseCase {
  constructor(private readonly repository: SearchRepository) {}

  getBrands(): Promise<string[]> {
    return this.repository.getBrands();
  }

  getModels(brand: string): Promise<string[]> {
    if (!brand) return Promise.resolve([]);
    return this.repository.getModels(brand);
  }

  getYears(brand: string, model: string): Promise<number[]> {
    if (!brand || !model) return Promise.resolve([]);
    return this.repository.getYears(brand, model);
  }
}
