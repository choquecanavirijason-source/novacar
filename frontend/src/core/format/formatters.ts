/**
 * Core · Formatters
 * Funciones puras de presentación de datos (cross-cutting, sin estado).
 */

import type { Locale } from "@core/i18n/dictionaries";

/**
 * El precio siempre es en pesos mexicanos (MXN) — eso no cambia con el idioma.
 * Pero el locale de formato sí debe seguir la UI: en "en", Intl antepone "MX$"
 * en vez de "$" a secas, para no confundir a un usuario angloparlante con USD.
 */
const CURRENCY_FORMATTER: Record<Locale, Intl.NumberFormat> = {
  es: new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }),
  en: new Intl.NumberFormat("en-US", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }),
};

export const formatCurrency = (value: number, locale: Locale = "es"): string =>
  CURRENCY_FORMATTER[locale].format(value);

export const formatAmperage = (amp: number): string => `${amp} A`;

export const formatVoltage = (volts: number): string => `${volts} V`;

/** Normaliza texto para búsqueda predictiva (sin acentos, minúsculas). */
export const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

export const formatStockLabel = (stock: number): string => {
  if (stock <= 0) return "Sin stock";
  if (stock < 5) return `Quedan ${stock}`;
  return "Disponible";
};
