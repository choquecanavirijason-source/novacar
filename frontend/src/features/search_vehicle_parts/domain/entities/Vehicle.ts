/**
 * Domain · Entity · Vehicle (Auto)
 * Modelo de datos puro del negocio. Sin dependencias de frameworks ni fetching.
 */

export interface Vehicle {
  readonly id: string;
  readonly brand: string;   // Marca   (ej: "Nissan")
  readonly model: string;   // Modelo  (ej: "Versa")
  readonly year: number;    // Año     (ej: 2021)
  readonly engine?: string; // Motorización opcional (ej: "1.6L")
}

/** Identifica de forma única una configuración Marca-Modelo-Año. */
export type VehicleSelection = {
  brand: string;
  model: string;
  year: number;
};
