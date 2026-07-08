/**
 * Core · Formatters
 * Funciones puras de presentación de datos (cross-cutting, sin estado).
 */

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number): string => currencyFormatter.format(value);

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
