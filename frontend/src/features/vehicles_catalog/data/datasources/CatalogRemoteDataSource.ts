/**
 * Data · DataSource · CatalogRemoteDataSource
 * El MOCK persiste en localStorage: mientras no haya backend, los autos que
 * el admin crea/edita/borra sobreviven a recargas de página en este navegador.
 */

import type { HttpClient } from "@core/http/HttpClient";
import type { NewCatalogVehicle } from "../../domain/entities/CatalogVehicle";
import type { CatalogVehicleDTO } from "../models/CatalogVehicleDTO";
import { toCatalogVehiclePayload } from "../mappers/vehicleMapper";

export interface CatalogRemoteDataSource {
  fetchAll(): Promise<CatalogVehicleDTO[]>;
  fetchById(id: string): Promise<CatalogVehicleDTO | null>;
  create(input: NewCatalogVehicle): Promise<CatalogVehicleDTO>;
  update(id: string, input: NewCatalogVehicle): Promise<CatalogVehicleDTO>;
  remove(id: string): Promise<void>;
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

  create(input: NewCatalogVehicle) {
    return this.http.post<CatalogVehicleDTO>("/admin/catalog/vehicles", toCatalogVehiclePayload(input));
  }

  update(id: string, input: NewCatalogVehicle) {
    return this.http.put<CatalogVehicleDTO>(`/admin/catalog/vehicles/${id}`, toCatalogVehiclePayload(input));
  }

  remove(id: string) {
    return this.http.delete<void>(`/admin/catalog/vehicles/${id}`);
  }
}

export const SEED: CatalogVehicleDTO[] = [
  {
    id: "nissan-versa-2021",
    brand: "Nissan",
    model: "Versa Sense",
    year: 2021,
    price: 289000,
    tagline: "Sedán eficiente, confiable y con bajo consumo.",
    body_type: "sedan",
    fuel_type: "gasolina",
    transmission: "automatica",
    condition: "seminuevo",
    mileage_km: 28000,
    horsepower: 118,
    seats: 5,
    features: ["Cámara de reversa", "Apple CarPlay", "Bluetooth", "Aire acondicionado"],
    image_url: "/vehicles/logo-cochabamba.png",
    accent_from: "#005f8f",
    accent_to: "#00aaff",
    highlighted: true,
    // Campos adicionales para detail expandido
    color: "plata/Rojo perlado/Rojo burdeos",
    doors: 4,
    cylinders: 4,
    displacement: "1.6L",
    drive_type: "FRONT WHEEL DRIVE",
    title_code: "FL - Certificate Of Title",
    sale_date: "2026-09-02",
    sale_time: "10:00 AM GMT-4",
    sale_location: "Miami, FL",
    has_keys: true,
    damage_type: "Abolladuras/arañazos Menores",
    damage_severity: "minor",
    damage_description: "Pequeñas abolladuras en puerta trasera izquierda y arañazos en parachoques delantero",
    notes: "Vehículo en excelente estado mecánico, mantenimiento al día",
    run_and_drive: true,
    highlights: ["Run and Drive", "Servicio reciente", "Historial de mantenimiento disponible"],
  },
  {
    id: "vw-jetta-2022",
    brand: "Volkswagen",
    model: "Jetta Trendline",
    year: 2022,
    price: 410000,
    tagline: "Premium alemán accesible, motor turbo TSI.",
    body_type: "sedan",
    fuel_type: "gasolina",
    transmission: "automatica",
    condition: "nuevo",
    mileage_km: 0,
    horsepower: 158,
    seats: 5,
    features: ["Turbo TSI", "Climatronic", "Control de crucero", "Sensores de estacionamiento"],
    accent_from: "#0077b3",
    accent_to: "#4dc4ff",
    highlighted: true,
    // Campos adicionales
    color: "Gris Platino",
    doors: 4,
    cylinders: 4,
    displacement: "1.4L",
    drive_type: "FRONT WHEEL DRIVE",
    title_code: "FL - Certificate Of Title",
    sale_date: "2026-09-03",
    sale_time: "11:30 AM GMT-4",
    sale_location: "Miami, FL",
    has_keys: true,
    damage_type: "Sin daños reportados",
    damage_severity: "none",
    damage_description: "Vehículo en estado 0 kilómetros, sin daños",
    notes: "Vehículo nuevo, garantía de fábrica vigente",
    run_and_drive: true,
    highlights: ["0 Kilómetros", "Garantía de fábrica", "Run and Drive"],
  },
  {
    id: "toyota-corolla-2023",
    brand: "Toyota",
    model: "Corolla Hybrid",
    year: 2023,
    price: 445000,
    tagline: "Híbrido líder en reventa.",
    body_type: "sedan",
    fuel_type: "hibrido",
    transmission: "automatica",
    condition: "nuevo",
    mileage_km: 0,
    horsepower: 138,
    seats: 5,
    features: ["Toyota Safety Sense", "Pantalla táctil 8\"", "Cámaras 360°", "Asientos de cuero"],
    accent_from: "#00aaff",
    accent_to: "#0088cc",
    highlighted: true,
    // Campos adicionales
    color: "Azul Metálico",
    doors: 4,
    cylinders: 4,
    displacement: "1.8L",
    drive_type: "FRONT WHEEL DRIVE",
    title_code: "FL - Certificate Of Title",
    sale_date: "2026-09-04",
    sale_time: "9:00 AM GMT-4",
    sale_location: "Miami, FL",
    has_keys: true,
    damage_type: "Sin daños reportados",
    damage_severity: "none",
    damage_description: "Vehículo nuevo de agencia",
    notes: "Primera unidad híbrida disponible, alta demanda",
    run_and_drive: true,
    highlights: ["Híbrido", "Eco-friendly", "Tecnología de punta"],
  },
  {
    id: "tesla-model3-2023",
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 985000,
    tagline: "100% eléctrico con autopilot.",
    body_type: "sedan",
    fuel_type: "electrico",
    transmission: "automatica",
    condition: "nuevo",
    mileage_km: 0,
    horsepower: 283,
    seats: 5,
    features: ["Autopilot", "Pantalla 15\"", "Acceso sin llave", "Actualizaciones OTA"],
    accent_from: "#00aaff",
    accent_to: "#0077b3",
    highlighted: true,
    // Campos adicionales
    color: "Blanco",
    doors: 4,
    cylinders: 0, // Eléctrico no tiene cilindros
    displacement: "Motor eléctrico",
    drive_type: "ALL WHEEL DRIVE",
    title_code: "FL - Certificate Of Title",
    sale_date: "2026-09-05",
    sale_time: "2:00 PM GMT-4",
    sale_location: "Miami, FL",
    has_keys: true,
    damage_type: "Sin daños reportados",
    damage_severity: "none",
    damage_description: "Vehículo 0 kilómetros, estado de fábrica",
    notes: "Incluye cargador Tesla y adaptador para hogar",
    run_and_drive: true,
    highlights: ["Eléctrico", "Autopilot", "Tecnología de vanguardia"],
  },
  {
    id: "bmw-e46-m3-2004",
    brand: "BMW",
    model: "E46 M3",
    year: 2004,
    price: 620000,
    tagline: "Ícono del tuning, motor S54 y carácter puro de pista.",
    body_type: "sedan",
    fuel_type: "gasolina",
    transmission: "manual",
    condition: "seminuevo",
    mileage_km: 32000,
    horsepower: 333,
    seats: 4,
    features: ["Escape deportivo", "Suspensión ajustable", "Asientos deportivos", "Techo solar"],
    accent_from: "#0077b3",
    accent_to: "#00aaff",
    highlighted: true,
    // Campos adicionales
    color: "Negro Carbón",
    doors: 4,
    cylinders: 6,
    displacement: "3.2L",
    drive_type: "REAR WHEEL DRIVE",
    title_code: "FL - Certificate Of Title",
    sale_date: "2026-09-06",
    sale_time: "10:00 AM GMT-4",
    sale_location: "Miami, FL",
    has_keys: true,
    damage_type: "Abolladuras/arañazos Menores",
    damage_severity: "minor",
    damage_description: "Detalles menores en pintura, acorde a su año y uso",
    notes: "Unidad coleccionable, mantenimiento por especialista BMW",
    run_and_drive: true,
    highlights: ["Run and Drive", "Coleccionable", "Mantenimiento al día", "Impecable mecánicamente"],
  },
  {
    id: "bmw-f650gs-2023",
    brand: "BMW",
    model: "F650GS",
    year: 2023,
    price: 248000,
    tagline: "Adventure todocamino, lista para ciudad y aventura.",
    body_type: "motocicleta",
    fuel_type: "gasolina",
    transmission: "manual",
    condition: "nuevo",
    mileage_km: 0,
    horsepower: 48,
    seats: 2,
    features: ["ABS", "Parabrisas ajustable", "GPS integrado", "Calentador de puños"],
    accent_from: "#0077b3",
    accent_to: "#00aaff",
    highlighted: false,
    // Campos adicionales
    color: "Negro Mate",
    doors: 0, // Motocicleta no tiene puertas
    cylinders: 2,
    displacement: "650cc",
    drive_type: "CHAIN DRIVE",
    title_code: "FL - Certificate Of Title",
    sale_date: "2026-09-07",
    sale_time: "11:00 AM GMT-4",
    sale_location: "Miami, FL",
    has_keys: true,
    damage_type: "Sin daños reportados",
    damage_severity: "none",
    damage_description: "Motocicleta nueva sin uso",
    notes: "Incluye maletas laterales y casco de cortesía",
    run_and_drive: true,
    highlights: ["0 Kilómetros", "Equipamiento completo", "Garantía BMW"],
  },
];


const STORAGE_KEY = "novacar.catalogVehicles";

function readStore(): CatalogVehicleDTO[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const vehicles = JSON.parse(raw) as CatalogVehicleDTO[];
    const migratedVehicles = vehicles.map((vehicle) =>
      vehicle.id === "nissan-versa-2021" && !vehicle.image_url
        ? { ...vehicle, image_url: "/vehicles/logo-cochabamba.png" }
        : vehicle,
    );
    if (migratedVehicles.some((vehicle, index) => vehicle !== vehicles[index])) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedVehicles));
    }
    return migratedVehicles;
  } catch {
    return SEED;
  }
}

function writeStore(vehicles: CatalogVehicleDTO[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
}

const delay = <T>(value: T, ms = 220): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export class CatalogMockDataSource implements CatalogRemoteDataSource {
  fetchAll() {
    return delay([...readStore()]);
  }

  fetchById(id: string) {
    return delay(readStore().find((v) => v.id === id) ?? null);
  }

  create(input: NewCatalogVehicle) {
    const vehicles = readStore();
    const slug = `${input.brand}-${input.model}-${input.year}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const dto: CatalogVehicleDTO = {
      id: vehicles.some((v) => v.id === slug) ? `${slug}-${Date.now()}` : slug,
      ...toCatalogVehiclePayload(input),
    };
    writeStore([dto, ...vehicles]);
    return delay(dto);
  }

  update(id: string, input: NewCatalogVehicle) {
    const vehicles = readStore();
    const current = vehicles.find((v) => v.id === id);
    if (!current) return Promise.reject(new Error("Vehículo no encontrado."));
    const updated: CatalogVehicleDTO = { id, ...toCatalogVehiclePayload(input) };
    writeStore(vehicles.map((v) => (v.id === id ? updated : v)));
    return delay(updated);
  }

  remove(id: string) {
    writeStore(readStore().filter((v) => v.id !== id));
    return delay(undefined);
  }
}
