/**
 * Domain · Entity · Part (Autoparte)
 * Entidad pura. Distingue subtipos relevantes del negocio: Batería y Fusible.
 */

export type PartCategory = "battery" | "fuse";

export interface BasePart {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly category: PartCategory;
  readonly brand: string;
  readonly price: number;
  readonly stock: number;
}

/** Batería: especificación eléctrica relevante para compatibilidad. */
export interface BatteryPart extends BasePart {
  readonly category: "battery";
  readonly amperage: number; // CCA / Amperaje
  readonly voltage: number;  // normalmente 12V
  readonly group: string;    // grupo BCI (ej: "Grupo 35")
}

/** Fusible: especificación de corriente. */
export interface FusePart extends BasePart {
  readonly category: "fuse";
  readonly amperage: number; // corriente nominal (ej: 10A)
  readonly type: string;     // tipo físico (ej: "Mini", "Blade")
  readonly color: string;    // código de color por amperaje
}

export type Part = BatteryPart | FusePart;

/** Type guards: la lógica de negocio decide sin acoplarse a strings sueltos. */
export const isBattery = (part: Part): part is BatteryPart => part.category === "battery";
export const isFuse = (part: Part): part is FusePart => part.category === "fuse";
