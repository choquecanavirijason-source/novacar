/**
 * Data · DTO · PartDTO
 * Representación de transporte de una autoparte (API/DB). Mezcla todos los campos;
 * el mapper la discrimina a BatteryPart | FusePart del dominio.
 */

export interface PartDTO {
  id: string;
  sku: string;
  name: string;
  category: string; // "battery" | "fuse" (string crudo)
  brand: string;
  price: number;
  stock: number;

  // Batería
  amperage?: number;
  voltage?: number;
  bci_group?: string;

  // Fusible
  fuse_type?: string;
  color?: string;
}
