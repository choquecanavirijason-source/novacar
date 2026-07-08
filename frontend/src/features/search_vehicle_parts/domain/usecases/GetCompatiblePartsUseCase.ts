/**
 * Domain · Use Case · GetCompatibleParts
 *
 * Lógica de negocio pura: dado un vehículo y (opcionalmente) una categoría,
 * devuelve las autopartes compatibles ordenadas y validadas.
 * Depende SÓLO de la interfaz SearchRepository (inversión de dependencias).
 */

import type { CompatibilityResult } from "../entities/Compatibility";
import type { PartCategory } from "../entities/Part";
import type { VehicleSelection } from "../entities/Vehicle";
import type { SearchRepository } from "../repositories/SearchRepository";

export interface GetCompatiblePartsInput {
  vehicle: VehicleSelection;
  category?: PartCategory;
}

export class GetCompatiblePartsUseCase {
  constructor(private readonly repository: SearchRepository) {}

  async execute(input: GetCompatiblePartsInput): Promise<CompatibilityResult> {
    const { vehicle, category } = input;

    if (!vehicle.brand || !vehicle.model || !vehicle.year) {
      throw new Error("Selección de vehículo incompleta: marca, modelo y año son obligatorios.");
    }

    const parts = await this.repository.getCompatibleParts(vehicle, category);

    // Regla de negocio: priorizar piezas con stock y luego por precio ascendente.
    const ordered = [...parts].sort((a, b) => {
      if ((b.stock > 0 ? 1 : 0) !== (a.stock > 0 ? 1 : 0)) {
        return (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0);
      }
      return a.price - b.price;
    });

    return {
      vehicle,
      compatibleParts: ordered,
      total: ordered.length,
    };
  }
}
