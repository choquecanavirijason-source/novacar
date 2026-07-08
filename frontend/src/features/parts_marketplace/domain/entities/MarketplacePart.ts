/**
 * Domain · Entity · MarketplacePart
 * Refacción/autoparte publicada en el marketplace. Modelo puro y rico para
 * alimentar tarjetas tipo e-commerce, filtros largos y página de detalle.
 */

export type PartCategory =
  | "engine"
  | "tires"
  | "seats"
  | "battery"
  | "fuse"
  | "brakes"
  | "suspension"
  | "oil"
  | "lights"
  | "filters"
  | "body"
  | "audio";

export type PartCondition = "nuevo" | "usado" | "reconstruido";

export const PART_CATEGORIES: PartCategory[] = [
  "engine",
  "tires",
  "seats",
  "battery",
  "fuse",
  "brakes",
  "suspension",
  "oil",
  "lights",
  "filters",
  "body",
  "audio",
];

export interface PartSpec {
  readonly label: string;
  readonly value: string;
}

export interface MarketplacePart {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly category: PartCategory;
  readonly brand: string;
  readonly condition: PartCondition;

  readonly price: number;
  readonly originalPrice?: number; // si hay descuento
  readonly stock: number;

  readonly rating: number; // 0–5
  readonly reviews: number;
  readonly seller: string;

  readonly freeShipping: boolean;
  readonly warrantyMonths: number; // 0 = sin garantía

  readonly compatibleBrands: ReadonlyArray<string>;
  readonly yearFrom: number;
  readonly yearTo: number;

  readonly specs: ReadonlyArray<PartSpec>;
  readonly accentFrom: string;
  readonly accentTo: string;
}

/** Porcentaje de descuento (entero), 0 si no aplica. */
export const discountPercent = (part: MarketplacePart): number =>
  part.originalPrice && part.originalPrice > part.price
    ? Math.round((1 - part.price / part.originalPrice) * 100)
    : 0;
