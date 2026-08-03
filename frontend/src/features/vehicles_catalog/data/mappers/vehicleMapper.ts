/**
 * Data · Mapper · vehicleMapper
 */

import type { CatalogVehicle, NewCatalogVehicle } from "../../domain/entities/CatalogVehicle";
import type { CatalogVehicleDTO } from "../models/CatalogVehicleDTO";

export const toCatalogVehicle = (dto: CatalogVehicleDTO): CatalogVehicle => ({
  id: dto.id,
  brand: dto.brand,
  model: dto.model,
  year: dto.year,
  price: dto.price,
  tagline: dto.tagline,
  bodyType: dto.body_type as CatalogVehicle["bodyType"],
  fuelType: dto.fuel_type as CatalogVehicle["fuelType"],
  transmission: dto.transmission as CatalogVehicle["transmission"],
  condition: dto.condition as CatalogVehicle["condition"],
  mileageKm: dto.mileage_km,
  horsepower: dto.horsepower,
  seats: dto.seats,
  features: dto.features,
  accentFrom: dto.accent_from,
  accentTo: dto.accent_to,
  highlighted: dto.highlighted,
});

export const toCatalogVehicles = (dtos: CatalogVehicleDTO[]): CatalogVehicle[] =>
  dtos.map(toCatalogVehicle);

export const toCatalogVehiclePayload = (input: NewCatalogVehicle) => ({
  brand: input.brand,
  model: input.model,
  year: input.year,
  price: input.price,
  tagline: input.tagline,
  body_type: input.bodyType,
  fuel_type: input.fuelType,
  transmission: input.transmission,
  condition: input.condition,
  mileage_km: input.mileageKm,
  horsepower: input.horsepower,
  seats: input.seats,
  features: [...input.features],
  accent_from: input.accentFrom,
  accent_to: input.accentTo,
  highlighted: input.highlighted,
});