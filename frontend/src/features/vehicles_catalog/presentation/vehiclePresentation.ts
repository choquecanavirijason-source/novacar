/**
 * Presentation · helpers de presentación del catálogo.
 * Mapea valores del dominio a iconos y a CLAVES de traducción (i18n).
 * El texto final se resuelve con `t(key)` en el componente.
 */

import type { BodyType, CatalogVehicle, FuelType, Transmission } from "../domain/entities/CatalogVehicle";

export const bodyTypeIcon: Record<BodyType, string> = {
  sedan: "🚗",
  suv: "🚙",
  hatchback: "🚘",
  pickup: "🛻",
  motocicleta: "🏍️",
};

export const bodyTypeKey: Record<BodyType, string> = {
  sedan: "body.sedan",
  suv: "body.suv",
  hatchback: "body.hatchback",
  pickup: "body.pickup",
  motocicleta: "body.motocicleta",
};

export const fuelKey: Record<FuelType, string> = {
  gasolina: "fuel.gasolina",
  hibrido: "fuel.hibrido",
  electrico: "fuel.electrico",
  diesel: "fuel.diesel",
};

export const transmissionKey: Record<Transmission, string> = {
  manual: "transmission.manual",
  automatica: "transmission.automatica",
};

/** Texto de kilometraje traducido. `t` proviene de useTranslation(). */
export const mileageText = (km: number, t: (k: string, v?: Record<string, string | number>) => string): string =>
  km === 0 ? t("common.newMileage") : t("common.km", { n: km.toLocaleString("es-MX") });

/**
 * Foto de stock libre de derechos (Unsplash License — uso comercial permitido,
 * sin atribución obligatoria) por tipo de carrocería, una por categoría.
 * Reemplaza al fallback anterior (loremflickr): ese servicio devuelve una
 * página de verificación anti-bot a peticiones no-navegador, con riesgo real
 * de que tampoco cargue como <img> para un visitante — decisión del usuario
 * 2026-09-23: priorizar confiabilidad (verificado 200 + image/jpeg) sobre la
 * variedad de una foto distinta por vehículo.
 */
const BODY_TYPE_STOCK_PHOTO_ID: Record<BodyType, string> = {
  sedan: "1583121274602-3e2820c69888",
  suv: "1533473359331-0135ef1b58bf",
  hatchback: "1502877338535-766e1452684a",
  pickup: "1601362840469-51e4d8d58785",
  motocicleta: "1558981806-ec527fa84c39",
};

/** Fotos reales propias (public/vehicles) para los autos que ya cuentan con asset. */
const VEHICLE_PHOTO_OVERRIDES: Record<string, string> = {
  "nissan-versa-2021": "/vehicles/Nissan.jpg",
  "vw-jetta-2022": "/vehicles/VW.jpg",
  "toyota-corolla-2023": "/vehicles/Toyota.jpg",
  "tesla-model3-2023": "/vehicles/Tesla.jpg",
  "bmw-e46-m3-2004": "/vehicles/BMW.jpg",
  "bmw-f650gs-2023": "/vehicles/BMW.jpg",
};

/**
 * URL de foto del vehículo: prioriza la imagen real cargada por el admin
 * (`imageUrl`); si falta, usa el asset propio de VEHICLE_PHOTO_OVERRIDES; si
 * tampoco existe, cae a la foto de stock por tipo de carrocería.
 */
export const vehiclePhotoUrl = (
  id: string,
  brand: string,
  bodyType: BodyType,
  size: { w: number; h: number } = { w: 640, h: 480 },
  imageUrl?: string,
): string => {
  if (imageUrl) return imageUrl;

  const override = VEHICLE_PHOTO_OVERRIDES[id];
  if (override) return override;

  const photoId = BODY_TYPE_STOCK_PHOTO_ID[bodyType] ?? BODY_TYPE_STOCK_PHOTO_ID.sedan;
  return `https://images.unsplash.com/photo-${photoId}?w=${size.w}&h=${size.h}&fit=crop&crop=center`;
};

/** Foto real de placeholder para el hero de la landing (a reemplazar por asset propio). */
export const HERO_CAR_PHOTO_URL = "https://loremflickr.com/900/650/car,sportscar?lock=42";

/**
 * "Ficha de lote" estilo subasta (Copart/IAAI): título, daño, run&drive, venta.
 * Mismos campos que ya usa VehicleDetail (`vdetail-additional-info`) — aquí se
 * comparte la lógica para que las tarjetas (grid/lista) muestren un adelanto
 * sin duplicar el mapeo severidad → color/etiqueta en cada componente.
 */
type DamageSeverity = CatalogVehicle["damageSeverity"];

const DAMAGE_BADGE_CLASS: Record<DamageSeverity, string> = {
  none: "bg-green-500/10 text-green-400 border-green-500/20",
  minor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  moderate: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  severe: "bg-red-500/10 text-red-400 border-red-500/20",
};

/** Clase de color del badge de daño, según severidad (mismo esquema que VehicleDetail). */
export const damageBadgeClass = (severity?: string): string =>
  DAMAGE_BADGE_CLASS[(severity as DamageSeverity) || "none"] ?? DAMAGE_BADGE_CLASS.none;

const DAMAGE_SEVERITY_KEY: Record<DamageSeverity, string> = {
  none: "detail.damageNone",
  minor: "detail.damageMinor",
  moderate: "detail.damageModerate",
  severe: "detail.damageSevere",
};

/** Clave i18n de la severidad del daño. */
export const damageSeverityKey = (severity?: string): string =>
  DAMAGE_SEVERITY_KEY[(severity as DamageSeverity) || "none"] ?? DAMAGE_SEVERITY_KEY.none;

/** True cuando el vehículo trae datos reales de lote (título, daño o venta capturados). */
export const hasAuctionInfo = (
  vehicle: Pick<CatalogVehicle, "titleCode" | "damageType" | "saleDate">,
): boolean => Boolean(vehicle.titleCode || vehicle.damageType || vehicle.saleDate);
