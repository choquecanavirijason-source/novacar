/**
 * Domain · Use Case · DeriveVehicleOptions
 * Deriva marcas → modelos → años disponibles a partir del catálogo real de
 * vehículos que administra el panel (`vehicles_catalog`), en vez de un
 * listado fijo desconectado de lo que el admin publica.
 */

import type { CatalogVehicle } from "@features/vehicles_catalog";

export class DeriveVehicleOptionsUseCase {
  getBrands(vehicles: CatalogVehicle[]): string[] {
    return [...new Set(vehicles.map((v) => v.brand))].sort((a, b) => a.localeCompare(b));
  }

  getModels(vehicles: CatalogVehicle[], brand: string): string[] {
    if (!brand) return [];
    return [...new Set(vehicles.filter((v) => v.brand === brand).map((v) => v.model))].sort((a, b) =>
      a.localeCompare(b),
    );
  }

  getYears(vehicles: CatalogVehicle[], brand: string, model: string): number[] {
    if (!brand || !model) return [];
    return [...new Set(vehicles.filter((v) => v.brand === brand && v.model === model).map((v) => v.year))].sort(
      (a, b) => b - a,
    );
  }
}
