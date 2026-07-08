/**
 * Domain · Entity · Compatibility
 * Relaciona un vehículo con las autopartes compatibles (matriz de compatibilidad).
 */

import type { Part } from "./Part";
import type { VehicleSelection } from "./Vehicle";

export interface CompatibilityMatrix {
  readonly vehicle: VehicleSelection;
  readonly parts: ReadonlyArray<Part>;
}

/** Resultado enriquecido de una búsqueda de compatibilidad. */
export interface CompatibilityResult {
  readonly vehicle: VehicleSelection;
  readonly compatibleParts: ReadonlyArray<Part>;
  readonly total: number;
}
