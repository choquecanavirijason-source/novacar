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
    features: ["Cámara de reversa", "Apple CarPlay"], accent_from: "#10827e", accent_to: "#1bc4b6", highlighted: true,
  },
  {
    id: "vw-jetta-2022", brand: "Volkswagen", model: "Jetta Trendline", year: 2022, price: 410000,
    tagline: "Premium alemán accesible, motor turbo TSI.", body_type: "sedan", fuel_type: "gasolina",
    transmission: "automatica", condition: "nuevo", mileage_km: 0, horsepower: 158, seats: 5,
    features: ["Turbo TSI", "Climatronic"], accent_from: "#2f8f88", accent_to: "#3fa89a", highlighted: true,
  },
  {
    id: "toyota-corolla-2023", brand: "Toyota", model: "Corolla Hybrid", year: 2023, price: 445000,
    tagline: "Híbrido líder en reventa.", body_type: "sedan", fuel_type: "hibrido",
    transmission: "automatica", condition: "nuevo", mileage_km: 0, horsepower: 138, seats: 5,
    features: ["Toyota Safety Sense"], accent_from: "#1bc4b6", accent_to: "#2fae95", highlighted: true,
  },
  {
    id: "tesla-model3-2023", brand: "Tesla", model: "Model 3", year: 2023, price: 985000,
    tagline: "100% eléctrico con autopilot.", body_type: "sedan", fuel_type: "electrico",
    transmission: "automatica", condition: "nuevo", mileage_km: 0, horsepower: 283, seats: 5,
    features: ["Autopilot"], accent_from: "#1bc4b6", accent_to: "#2f8f88", highlighted: true,
  },
  {
    id: "honda-cbr-2022", brand: "Honda", model: "CBR 600RR", year: 2022, price: 315000,
    tagline: "Deportiva ligera, respuesta inmediata y diseño agresivo.", body_type: "motocicleta", fuel_type: "gasolina",
    transmission: "manual", condition: "seminuevo", mileage_km: 18000, horsepower: 118, seats: 2,
    features: ["ABS", "Inyección electrónica"], accent_from: "#ff6b6b", accent_to: "#ff9b3d", highlighted: true,
  },
  {
    id: "yamaha-mt03-2023", brand: "Yamaha", model: "MT-03", year: 2023, price: 248000,
    tagline: "Naked versátil ideal para ciudad y carretera.", body_type: "motocicleta", fuel_type: "gasolina",
    transmission: "manual", condition: "nuevo", mileage_km: 0, horsepower: 42, seats: 2,
    features: ["LED", "Control de crucero"], accent_from: "#2f8f88", accent_to: "#1bc4b6", highlighted: false,
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