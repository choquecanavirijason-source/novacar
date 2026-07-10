/**
 * Data · DataSource · MarketplaceRemoteDataSource
 * Implementación HTTP (REST) lista para producción + MOCK in-memory para correr sin backend.
 */

import type { HttpClient } from "@core/http/HttpClient";
import type { MarketplacePartDTO } from "../models/MarketplacePartDTO";

export interface MarketplaceRemoteDataSource {
  fetchAll(): Promise<MarketplacePartDTO[]>;
  fetchById(id: string): Promise<MarketplacePartDTO | null>;
}

/* ---- Implementación HTTP real ---- */
export class MarketplaceHttpDataSource implements MarketplaceRemoteDataSource {
  constructor(private readonly http: HttpClient) {}
  fetchAll() {
    return this.http.get<MarketplacePartDTO[]>("/marketplace/parts");
  }
  fetchById(id: string) {
    return this.http.get<MarketplacePartDTO | null>(`/marketplace/parts/${id}`);
  }
}

/* ---- Dataset mock ---- */
const ALL_BRANDS = ["Nissan", "Volkswagen", "Toyota", "Mazda", "Honda", "Chevrolet", "Ford", "Hyundai", "Kia"];

const P = (
  id: string,
  name: string,
  category: string,
  brand: string,
  condition: string,
  price: number,
  extra: Partial<MarketplacePartDTO>,
): MarketplacePartDTO => ({
  id,
  sku: id.toUpperCase(),
  name,
  category,
  brand,
  condition,
  price,
  stock: 8,
  rating: 4.5,
  reviews: 40,
  seller: "NOVACAR Oficial",
  free_shipping: true,
  warranty_months: 12,
  compatible_brands: ALL_BRANDS.slice(0, 4),
  year_from: 2012,
  year_to: 2024,
  specs: [],
  accent_from: "#005f8f",
  accent_to: "#00aaff",
  ...extra,
});

const MOCK: MarketplacePartDTO[] = [
  // Motores
  P("eng-1", "Motor 1.6L 16v reconstruido", "engine", "Nissan", "reconstruido", 38500, {
    original_price: 45000, stock: 3, rating: 4.7, reviews: 28, warranty_months: 6, accent_from: "#ff6b6b", accent_to: "#ff9b3d",
    compatible_brands: ["Nissan"], specs: [{ label: "Cilindrada", value: "1.6L" }, { label: "Válvulas", value: "16v" }, { label: "Combustible", value: "Gasolina" }],
  }),
  P("eng-2", "Motor 2.0 TSI turbo seminuevo", "engine", "Volkswagen", "usado", 64900, {
    stock: 1, rating: 4.4, reviews: 12, free_shipping: false, warranty_months: 3, accent_from: "#0077b3", accent_to: "#4dc4ff",
    compatible_brands: ["Volkswagen"], specs: [{ label: "Cilindrada", value: "2.0L" }, { label: "Inducción", value: "Turbo TSI" }],
  }),
  // Llantas
  P("tir-1", "Llanta 205/55 R16 (juego de 4)", "tires", "Michelin", "nuevo", 7600, {
    stock: 24, rating: 4.9, reviews: 210, accent_from: "#00aaff", accent_to: "#0088cc",
    compatible_brands: ALL_BRANDS, specs: [{ label: "Medida", value: "205/55 R16" }, { label: "Piezas", value: "4" }],
  }),
  P("tir-2", "Llanta 195/65 R15 (juego de 4)", "tires", "Goodyear", "nuevo", 6200, {
    original_price: 7000, stock: 16, rating: 4.6, reviews: 98, accent_from: "#0088cc", accent_to: "#00aaff",
    compatible_brands: ALL_BRANDS, specs: [{ label: "Medida", value: "195/65 R15" }, { label: "Piezas", value: "4" }],
  }),
  // Asientos
  P("sea-1", "Asiento delantero de piel", "seats", "OEM", "usado", 4300, {
    stock: 5, rating: 4.2, reviews: 17, free_shipping: false, warranty_months: 0, accent_from: "#9a9c97", accent_to: "#005f8f",
    specs: [{ label: "Material", value: "Piel" }, { label: "Posición", value: "Delantero" }],
  }),
  P("sea-2", "Par de asientos deportivos", "seats", "Recaro", "nuevo", 18900, {
    stock: 2, rating: 4.8, reviews: 34, accent_from: "#ff6b6b", accent_to: "#0077b3",
    specs: [{ label: "Tipo", value: "Deportivo" }, { label: "Piezas", value: "2" }],
  }),
  // Baterías
  P("bat-1", "Batería LTH Grupo 35 · 600 CCA", "battery", "LTH", "nuevo", 2890, {
    stock: 30, rating: 4.7, reviews: 156, accent_from: "#005f8f", accent_to: "#00aaff",
    specs: [{ label: "Grupo", value: "BCI 35" }, { label: "CCA", value: "600 A" }, { label: "Voltaje", value: "12 V" }],
  }),
  P("bat-2", "Batería Bosch S4 Grupo 42 · 700 CCA", "battery", "Bosch", "nuevo", 3450, {
    stock: 14, rating: 4.8, reviews: 89, accent_from: "#00aaff", accent_to: "#0077b3",
    specs: [{ label: "Grupo", value: "BCI 42" }, { label: "CCA", value: "700 A" }],
  }),
  // Fusibles
  P("fus-1", "Kit de fusibles Mini (surtido 120 pzs)", "fuse", "Littelfuse", "nuevo", 320, {
    stock: 200, rating: 4.9, reviews: 320, accent_from: "#0088cc", accent_to: "#00aaff",
    compatible_brands: ALL_BRANDS, specs: [{ label: "Tipo", value: "Mini" }, { label: "Piezas", value: "120" }],
  }),
  P("fus-2", "Fusibles Blade surtido (80 pzs)", "fuse", "Bosch", "nuevo", 240, {
    stock: 150, rating: 4.7, reviews: 142, accent_from: "#005f8f", accent_to: "#0088cc",
    compatible_brands: ALL_BRANDS, specs: [{ label: "Tipo", value: "Blade" }, { label: "Piezas", value: "80" }],
  }),
  // Frenos
  P("brk-1", "Balatas cerámicas delanteras", "brakes", "Brembo", "nuevo", 1290, {
    stock: 40, rating: 4.8, reviews: 76, accent_from: "#ff6b6b", accent_to: "#ff9b3d",
    specs: [{ label: "Tipo", value: "Cerámica" }, { label: "Posición", value: "Delantero" }],
  }),
  P("brk-2", "Discos de freno ventilados (par)", "brakes", "ATE", "nuevo", 2150, {
    original_price: 2600, stock: 18, rating: 4.6, reviews: 51, accent_from: "#0077b3", accent_to: "#00aaff",
    specs: [{ label: "Tipo", value: "Ventilado" }, { label: "Piezas", value: "2" }],
  }),
  // Suspensión
  P("sus-1", "Amortiguadores delanteros (par)", "suspension", "Monroe", "nuevo", 3380, {
    stock: 12, rating: 4.5, reviews: 44, accent_from: "#9a9c97", accent_to: "#005f8f",
    specs: [{ label: "Posición", value: "Delantero" }, { label: "Piezas", value: "2" }],
  }),
  P("sus-2", "Kit de horquillas y rótulas", "suspension", "Moog", "reconstruido", 2480, {
    stock: 6, rating: 4.3, reviews: 22, warranty_months: 6, accent_from: "#00aaff", accent_to: "#0077b3",
    specs: [{ label: "Incluye", value: "Horquillas + rótulas" }],
  }),
  // Aceites
  P("oil-1", "Aceite sintético 5W-30 (4L)", "oil", "Mobil 1", "nuevo", 690, {
    stock: 120, rating: 4.9, reviews: 410, accent_from: "#0088cc", accent_to: "#00aaff",
    compatible_brands: ALL_BRANDS, warranty_months: 0, specs: [{ label: "Viscosidad", value: "5W-30" }, { label: "Volumen", value: "4 L" }],
  }),
  P("oil-2", "Aceite semisintético 10W-40 (5L)", "oil", "Castrol", "nuevo", 540, {
    stock: 90, rating: 4.6, reviews: 188, accent_from: "#005f8f", accent_to: "#0088cc",
    compatible_brands: ALL_BRANDS, warranty_months: 0, specs: [{ label: "Viscosidad", value: "10W-40" }, { label: "Volumen", value: "5 L" }],
  }),
  // Luces
  P("lig-1", "Faro delantero LED (lado izq.)", "lights", "Philips", "nuevo", 2890, {
    stock: 9, rating: 4.5, reviews: 37, accent_from: "#00aaff", accent_to: "#4dc4ff",
    specs: [{ label: "Tecnología", value: "LED" }, { label: "Lado", value: "Izquierdo" }],
  }),
  P("lig-2", "Kit de halógenos H4 (par)", "lights", "Osram", "nuevo", 380, {
    stock: 60, rating: 4.4, reviews: 64, free_shipping: false, accent_from: "#ff9b3d", accent_to: "#ff6b6b",
    compatible_brands: ALL_BRANDS, specs: [{ label: "Base", value: "H4" }, { label: "Piezas", value: "2" }],
  }),
  P("lig-3", "Faro LED para motocicleta", "lights", "DKR", "nuevo", 1820, {
    stock: 10, rating: 4.7, reviews: 41, accent_from: "#ff6b6b", accent_to: "#00aaff",
    compatible_brands: ["Honda", "Yamaha", "Kawasaki"], specs: [{ label: "Tecnología", value: "LED" }, { label: "Uso", value: "Moto" }],
  }),
  // Filtros
  P("fil-1", "Filtro de aire de alto flujo", "filters", "K&N", "nuevo", 760, {
    stock: 48, rating: 4.7, reviews: 120, accent_from: "#0088cc", accent_to: "#005f8f",
    specs: [{ label: "Tipo", value: "Aire" }, { label: "Reutilizable", value: "Sí" }],
  }),
  P("fil-2", "Kit filtros aceite + cabina", "filters", "Mann", "nuevo", 410, {
    stock: 70, rating: 4.6, reviews: 88, accent_from: "#005f8f", accent_to: "#00aaff",
    specs: [{ label: "Incluye", value: "Aceite + cabina" }],
  }),
  P("fil-3", "Filtro de aire para motocicleta", "filters", "DNA", "nuevo", 540, {
    stock: 18, rating: 4.8, reviews: 67, accent_from: "#ff6b6b", accent_to: "#ff9b3d",
    compatible_brands: ["Honda", "Yamaha"], specs: [{ label: "Tipo", value: "Aire" }, { label: "Uso", value: "Moto" }],
  }),
  // Carrocería
  P("bod-1", "Cofre/capó de lámina", "body", "OEM", "usado", 5200, {
    stock: 3, rating: 4.1, reviews: 9, free_shipping: false, warranty_months: 0, accent_from: "#9a9c97", accent_to: "#0077b3",
    specs: [{ label: "Pieza", value: "Cofre" }, { label: "Material", value: "Lámina" }],
  }),
  P("bod-2", "Espejo lateral eléctrico (der.)", "body", "OEM", "nuevo", 1480, {
    stock: 11, rating: 4.5, reviews: 26, accent_from: "#0077b3", accent_to: "#00aaff",
    specs: [{ label: "Pieza", value: "Espejo" }, { label: "Lado", value: "Derecho" }],
  }),
  // Audio
  P("aud-1", "Estéreo Android 9\" CarPlay", "audio", "Pioneer", "nuevo", 4200, {
    original_price: 5100, stock: 15, rating: 4.8, reviews: 175, accent_from: "#00aaff", accent_to: "#0077b3",
    compatible_brands: ALL_BRANDS, specs: [{ label: "Pantalla", value: "9\"" }, { label: "Sistema", value: "Android + CarPlay" }],
  }),
  P("aud-2", "Bocinas 6.5\" 2 vías (par)", "audio", "JBL", "nuevo", 1290, {
    stock: 33, rating: 4.6, reviews: 142, accent_from: "#005f8f", accent_to: "#0088cc",
    compatible_brands: ALL_BRANDS, specs: [{ label: "Tamaño", value: "6.5\"" }, { label: "Vías", value: "2" }],
  }),
];

const delay = <T>(value: T, ms = 240): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export class MarketplaceMockDataSource implements MarketplaceRemoteDataSource {
  fetchAll() {
    return delay([...MOCK]);
  }
  fetchById(id: string) {
    return delay(MOCK.find((p) => p.id === id) ?? null);
  }
}
