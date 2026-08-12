/**
 * Composition Root del módulo `search_vehicle_parts`.
 * Sin datasource/repositorio propios: los datos reales (vehículos y
 * autopartes) vienen de `vehicles_catalog` y `parts_marketplace` — este
 * módulo solo aporta la lógica pura de derivación/filtrado de compatibilidad.
 */

import { DeriveVehicleOptionsUseCase } from "./domain/usecases/DeriveVehicleOptionsUseCase";
import { GetCompatiblePartsUseCase } from "./domain/usecases/GetCompatiblePartsUseCase";
import { CalculateBatteryAmperageUseCase } from "./domain/usecases/CalculateBatteryAmperageUseCase";

export const searchUseCases = {
  deriveVehicleOptions: new DeriveVehicleOptionsUseCase(),
  getCompatibleParts: new GetCompatiblePartsUseCase(),
  calculateBatteryAmperage: new CalculateBatteryAmperageUseCase(),
} as const;
