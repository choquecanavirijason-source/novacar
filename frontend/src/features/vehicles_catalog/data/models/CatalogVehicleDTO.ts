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
  top_speed_kmh: number;
  zero_to_hundred_sec: number;
  availability: string;
  features: string[];
  image_url?: string;
  accent_from: string;
  accent_to: string;
  highlighted: boolean;
  color: string;
  doors: number;
  cylinders: number;
  displacement: string;
  drive_type: string;
  title_code: string;
  sale_date: string;
  sale_time: string;
  sale_location: string;
  has_keys: boolean;
  damage_type: string;
  damage_severity: "none" | "minor" | "moderate" | "severe";
  damage_description: string;
  notes: string;
  run_and_drive: boolean;
  highlights: string[];
}