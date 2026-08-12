/**
 * Domain · Entity · VehicleSelection
 * Identifica de forma única la selección marca-modelo-año que hace el
 * usuario en el buscador por pasos.
 */

export type VehicleSelection = {
  brand: string;
  model: string;
  year: number;
};
