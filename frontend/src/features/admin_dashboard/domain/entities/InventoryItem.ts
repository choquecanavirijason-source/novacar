/**
 * Domain · Entity · InventoryItem
 * Conteo interno de bodega (baterías/fusibles físicos en almacén) para
 * alertas de reorden. No es contenido público: eso lo maneja el catálogo
 * de Vehículos (`vehicles_catalog`) y el marketplace de Autopartes
 * (`parts_marketplace`), que son independientes de este stock interno.
 */

export interface InventoryItem {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly category: "battery" | "fuse";
  readonly stock: number;
  readonly price: number;
  readonly reorderLevel: number; // umbral de alerta de stock bajo
}

/** Datos que el administrador captura al dar de alta una pieza nueva. */
export type NewInventoryItem = Omit<InventoryItem, "id" | "sku">;

/** Regla de negocio reutilizable. */
export const isLowStock = (item: InventoryItem): boolean =>
  item.stock <= item.reorderLevel;
