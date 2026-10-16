/**
 * Domain · Entity · ImportModelCatalog
 * Catálogo de referencia de marcas/modelos (autos y motos) que usa la
 * calculadora de importación. Es solo para autocompletar — no es inventario.
 */

export type ImportVehicleKind = "car" | "moto";

export interface ImportBrandModels {
  readonly brand: string;
  readonly models: readonly string[];
}

export type ImportModelCatalog = Readonly<Record<ImportVehicleKind, readonly ImportBrandModels[]>>;
