/**
 * Domain · Use Case · CalculateBatteryAmperage
 * Lógica de negocio pura, sin I/O: recomienda el amperaje (CCA) mínimo
 * sugerido para un vehículo en función de su cilindrada/año.
 */

import type { VehicleSelection } from "../entities/Vehicle";

export interface BatteryRecommendation {
  recommendedCCA: number;
  voltage: number;
  note: string;
}

export class CalculateBatteryAmperageUseCase {
  execute(vehicle: VehicleSelection, engineLiters = 1.6): BatteryRecommendation {
    // Heurística simple de negocio: base por cilindrada + ajuste por antigüedad.
    const base = Math.round(350 + engineLiters * 180);
    const agePenalty = Math.max(0, 2015 - vehicle.year) * 4; // baterías antiguas piden más CCA
    const recommendedCCA = base + agePenalty;

    return {
      recommendedCCA,
      voltage: 12,
      note: `Sugerido para ${vehicle.brand} ${vehicle.model} ${vehicle.year}. Verifica el grupo BCI físico.`,
    };
  }
}
