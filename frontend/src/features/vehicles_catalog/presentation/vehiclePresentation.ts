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
};

export const fuelIcon: Record<FuelType, string> = {
  gasolina: "⛽",
  hibrido: "🌱",
  electrico: "⚡",
  diesel: "🛢️",
};

export const bodyTypeKey: Record<BodyType, string> = {
  sedan: "body.sedan",
  suv: "body.suv",
  hatchback: "body.hatchback",
  pickup: "body.pickup",
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
