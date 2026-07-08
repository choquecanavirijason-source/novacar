/**
 * Presentation · helpers de presentación del catálogo.
 * Mapea valores del dominio a iconos y a CLAVES de traducción (i18n).
 * El texto final se resuelve con `t(key)` en el componente.
 */

import type { BodyType, FuelType, Transmission } from "../domain/entities/CatalogVehicle";

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
 * URL de foto real de placeholder (a reemplazar por assets propios).
 * Genera una foto de auto vía keyword (marca + carrocería), con semilla estable
 * por id para que la misma tarjeta muestre siempre la misma imagen.
 */
export const vehiclePhotoUrl = (
  id: string,
  brand: string,
  bodyType: BodyType,
  size: { w: number; h: number } = { w: 640, h: 480 },
): string => {
  const seed = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const keywords = encodeURIComponent(`car,${brand},${bodyType}`);
  return `https://loremflickr.com/${size.w}/${size.h}/${keywords}?lock=${seed}`;
};

/** Foto real de placeholder para el hero de la landing (a reemplazar por asset propio). */
export const HERO_CAR_PHOTO_URL = "https://loremflickr.com/900/650/car,sportscar?lock=42";
