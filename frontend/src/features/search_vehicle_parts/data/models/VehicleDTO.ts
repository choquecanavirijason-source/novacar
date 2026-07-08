/**
 * Data · DTO · VehicleDTO
 * Estructura cruda tal como llega de la API/Firebase (snake_case, campos extra…).
 * No se usa fuera de la capa /data: se transforma a Entity vía mapper.
 */

export interface VehicleDTO {
  id: string;
  brand_name: string;
  model_name: string;
  model_year: number;
  engine_label?: string;
}
