/**
 * Domain · Entity · InventoryItem
 * Ítem de inventario gestionable desde el panel.
 */

export interface InventoryItem {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly category: "vehicle" | "battery" | "fuse";
  readonly stock: number;
  readonly price: number;
  readonly reorderLevel: number; // umbral de alerta de stock bajo
}

/** Regla de negocio reutilizable. */
export const isLowStock = (item: InventoryItem): boolean =>
  item.stock <= item.reorderLevel;
