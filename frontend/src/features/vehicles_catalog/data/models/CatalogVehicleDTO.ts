/**
 * Data · DTO · CatalogVehicleDTO
 */

export interface CatalogVehicleDTO {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  tagline: string;
  body_type: string;
  fuel_type: string;
  transmission: string;
  condition: string;
  mileage_km: number;
  horsepower: number;
  seats: number;
  features: string[];
  accent_from: string;
  accent_to: string;
  highlighted: boolean;
}