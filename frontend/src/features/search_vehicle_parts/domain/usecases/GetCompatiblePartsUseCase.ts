/**
 * Domain · Use Case · GetCompatibleParts
 * Filtra el inventario real de autopartes (`parts_marketplace`) por
 * compatibilidad con el vehículo elegido: misma marca (o pieza universal,
 * sin marcas registradas) y año dentro del rango `yearFrom`–`yearTo` que
 * captura el admin. El modelo no participa del filtro porque el admin no
 * registra compatibilidad a nivel de modelo, solo marca + rango de año.
 */

import type { MarketplacePart, PartCategory } from "@features/parts_marketplace";
import type { VehicleSelection } from "../entities/Vehicle";

export interface GetCompatiblePartsInput {
  parts: MarketplacePart[];
  vehicle: VehicleSelection;
  category?: PartCategory;
}

export class GetCompatiblePartsUseCase {
  execute({ parts, vehicle, category }: GetCompatiblePartsInput): MarketplacePart[] {
    if (!vehicle.brand || !vehicle.year) {
      throw new Error("Selección de vehículo incompleta: marca y año son obligatorios.");
    }

    const filtered = parts.filter((p) => {
      if (category && p.category !== category) return false;
      const brandMatch = p.compatibleBrands.length === 0 || p.compatibleBrands.includes(vehicle.brand);
      const yearMatch = vehicle.year >= p.yearFrom && vehicle.year <= p.yearTo;
      return brandMatch && yearMatch;
    });

    // Regla de negocio: priorizar piezas con stock y luego por precio ascendente.
    return [...filtered].sort((a, b) => {
      if ((b.stock > 0 ? 1 : 0) !== (a.stock > 0 ? 1 : 0)) {
        return (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0);
      }
      return a.price - b.price;
    });
  }
}
