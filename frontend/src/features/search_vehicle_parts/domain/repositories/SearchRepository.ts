/**
 * Domain · Repository Contract · SearchRepository
 *
 * Define QUÉ datos necesita el negocio, no CÓMO se obtienen.
 * La capa /data implementa esta interfaz (API REST, Firebase, GraphQL, mock…).
 * Regla de dependencia: el dominio no conoce la implementación.
 */

import type { Part, PartCategory } from "../entities/Part";
import type { VehicleSelection } from "../entities/Vehicle";

export interface SearchRepository {
  /** Catálogo de marcas disponibles. */
  getBrands(): Promise<string[]>;

  /** Modelos disponibles para una marca. */
  getModels(brand: string): Promise<string[]>;

  /** Años disponibles para una marca + modelo. */
  getYears(brand: string, model: string): Promise<number[]>;

  /** Autopartes compatibles con el vehículo, filtrables por categoría. */
  getCompatibleParts(
    vehicle: VehicleSelection,
    category?: PartCategory,
  ): Promise<Part[]>;
}
