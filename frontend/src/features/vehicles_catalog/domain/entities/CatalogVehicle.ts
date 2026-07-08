/**
 * Domain · Entity · CatalogVehicle
 * Auto del catálogo público (landing + explorador). Modelo puro y rico
 * para alimentar tarjetas, filtros y página de detalle.
 */

export type BodyType = "sedan" | "suv" | "hatchback" | "pickup" | "motocicleta";
export type FuelType = "gasolina" | "hibrido" | "electrico" | "diesel";
export type Transmission = "manual" | "automatica";
export type Condition = "nuevo" | "seminuevo";

export interface CatalogVehicle {
  readonly id: string;
  readonly brand: string;
  readonly model: string;
  readonly year: number;
  readonly price: number;
  readonly tagline: string;

  readonly bodyType: BodyType;
  readonly fuelType: FuelType;
  readonly transmission: Transmission;
  readonly condition: Condition;

  readonly mileageKm: number;     // 0 = nuevo
  readonly horsepower: number;
  readonly seats: number;

  readonly features: ReadonlyArray<string>;
  /** Colores para la "foto" generada (gradiente), evita depender de assets. */
  readonly accentFrom: string;
  readonly accentTo: string;
  readonly highlighted: boolean;  // destacado en landing
}

/** Opciones disponibles para construir los filtros de la UI. */
export interface CatalogFilterOptions {
  readonly brands: string[];
  readonly bodyTypes: BodyType[];
  readonly fuelTypes: FuelType[];
  readonly priceRange: { min: number; max: number };
}

/** Criterios de filtrado (todos opcionales). */
export interface VehicleFilters {
  brand?: string;
  bodyType?: BodyType;
  fuelType?: FuelType;
  maxPrice?: number;
  search?: string;
}
