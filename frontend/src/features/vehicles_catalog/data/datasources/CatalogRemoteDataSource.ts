/**
 * Data · DataSource · CatalogRemoteDataSource
 */

import type { HttpClient } from "@core/http/HttpClient";
import type { CatalogVehicleDTO } from "../models/CatalogVehicleDTO";

export interface CatalogRemoteDataSource {
  fetchAll(): Promise<CatalogVehicleDTO[]>;
  fetchById(id: string): Promise<CatalogVehicleDTO | null>;
}

export class CatalogHttpDataSource implements CatalogRemoteDataSource {
  constructor(private readonly http: HttpClient) {}

  fetchAll() {
    return this.http.get<CatalogVehicleDTO[]>("/catalog/vehicles");
  }

  fetchById(id: string) {
    return this.http
      .get<CatalogVehicleDTO>(`/catalog/vehicles/${id}`)
      .catch(() => null);
  }
}

const MOCK: CatalogVehicleDTO[] = [
  {
    id: "nissan-versa-2021", brand: "Nissan", model: "Versa Sense", year: 2021, price: 289000,
    tagline: "Sedán eficiente, confiable y con bajo consumo.", body_type: "sedan", fuel_type: "gasolina",
    transmission: "automatica", condition: "seminuevo", mileage_km: 28000, horsepower: 118, seats: 5,
    features: ["Cámara de reversa", "Apple CarPlay"], accent_from: "#3d6bff", accent_to: "#22e0ff", highlighted: true,
  },
  {
    id: "vw-jetta-2022", brand: "Volkswagen", model: "Jetta Trendline", year: 2022, price: 410000,
    tagline: "Premium alemán accesible, motor turbo TSI.", body_type: "sedan", fuel_type: "gasolina",
    transmission: "automatica", condition: "nuevo", mileage_km: 0, horsepower: 158, seats: 5,
    features: ["Turbo TSI", "Climatronic"], accent_from: "#5b6cff", accent_to: "#9b5bff", highlighted: true,
  },
  {
    id: "toyota-corolla-2023", brand: "Toyota", model: "Corolla Hybrid", year: 2023, price: 445000,
    tagline: "Híbrido líder en reventa.", body_type: "sedan", fuel_type: "hibrido",
    transmission: "automatica", condition: "nuevo", mileage_km: 0, horsepower: 138, seats: 5,
    features: ["Toyota Safety Sense"], accent_from: "#22e0ff", accent_to: "#2ee6a6", highlighted: true,
  },
  {
    id: "tesla-model3-2023", brand: "Tesla", model: "Model 3", year: 2023, price: 985000,
    tagline: "100% eléctrico con autopilot.", body_type: "sedan", fuel_type: "electrico",
    transmission: "automatica", condition: "nuevo", mileage_km: 0, horsepower: 283, seats: 5,
    features: ["Autopilot"], accent_from: "#22e0ff", accent_to: "#5b6cff", highlighted: true,
  },
];

const delay = <T>(value: T, ms = 220): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export class CatalogMockDataSource implements CatalogRemoteDataSource {
  fetchAll() {
    return delay([...MOCK]);
  }
  fetchById(id: string) {
    return delay(MOCK.find((v) => v.id === id) ?? null);
  }
}