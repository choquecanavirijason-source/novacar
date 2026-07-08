/**
 * Domain · Use Case · FilterVehicles
 * Lógica de negocio pura de filtrado/búsqueda del catálogo.
 * También deriva las opciones de filtro disponibles del dataset completo.
 */

import type {
  CatalogFilterOptions,
  CatalogVehicle,
  VehicleFilters,
} from "../entities/CatalogVehicle";
import type { CatalogRepository } from "../repositories/CatalogRepository";

const normalize = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export class FilterVehiclesUseCase {
  constructor(private readonly repository: CatalogRepository) {}

  async getOptions(): Promise<CatalogFilterOptions> {
    const all = await this.repository.getAll();
    const prices = all.map((v) => v.price);
    return {
      brands: [...new Set(all.map((v) => v.brand))].sort(),
      bodyTypes: [...new Set(all.map((v) => v.bodyType))],
      fuelTypes: [...new Set(all.map((v) => v.fuelType))],
      priceRange: { min: Math.min(...prices), max: Math.max(...prices) },
    };
  }

  async execute(filters: VehicleFilters): Promise<CatalogVehicle[]> {
    const all = await this.repository.getAll();
    const q = filters.search ? normalize(filters.search) : null;

    return all.filter((v) => {
      if (filters.brand && v.brand !== filters.brand) return false;
      if (filters.bodyType && v.bodyType !== filters.bodyType) return false;
      if (filters.fuelType && v.fuelType !== filters.fuelType) return false;
      if (filters.maxPrice && v.price > filters.maxPrice) return false;
      if (q && !normalize(`${v.brand} ${v.model}`).includes(q)) return false;
      return true;
    });
  }
}
