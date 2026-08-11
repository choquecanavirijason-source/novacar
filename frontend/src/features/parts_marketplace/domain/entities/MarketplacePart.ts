/**
 * Domain · Entity · MarketplacePart
 * Refacción/autoparte publicada en el marketplace. Modelo puro y rico para
 * alimentar tarjetas tipo e-commerce, filtros largos, página de detalle y el
 * inventario interno del panel admin (stock/reorden). Único modelo para
 * "Piezas" y "Autopartes" — antes eran dos entidades separadas.
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

  readonly price: number; // precio base, antes de descuento
  readonly discountPercent: number; // 0–100, 0 = sin descuento
  readonly stock: number;
  readonly reorderLevel: number; // umbral de alerta de stock bajo

  /** URL de foto real (pegada por el admin). Si falta, se usa un placeholder. */
  readonly imageUrl?: string;

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

/** Datos que el administrador captura al crear/editar una pieza/autoparte. */
export type NewMarketplacePart = Omit<MarketplacePart, "id">;

/** Precio final ya aplicado el descuento. */
export const finalPrice = (part: Pick<MarketplacePart, "price" | "discountPercent">): number =>
  Math.round(part.price * (1 - part.discountPercent / 100));

/** Regla de negocio reutilizable: stock en o por debajo del umbral de reorden. */
export const isLowStock = (part: Pick<MarketplacePart, "stock" | "reorderLevel">): boolean =>
  part.stock <= part.reorderLevel;
