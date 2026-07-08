/**
 * Data · Mapper · partMapper
 * Función pura: PartDTO (transporte) -> Part (dominio). Desacoplamiento total.
 */

import type { Part } from "../../domain/entities/Part";
import type { PartDTO } from "../models/PartDTO";

export const toPartEntity = (dto: PartDTO): Part => {
  if (dto.category === "battery") {
    return {
      id: dto.id,
      sku: dto.sku,
      name: dto.name,
      category: "battery",
      brand: dto.brand,
      price: dto.price,
      stock: dto.stock,
      amperage: dto.amperage ?? 0,
      voltage: dto.voltage ?? 12,
      group: dto.bci_group ?? "N/D",
    };
  }

  return {
    id: dto.id,
    sku: dto.sku,
    name: dto.name,
    category: "fuse",
    brand: dto.brand,
    price: dto.price,
    stock: dto.stock,
    amperage: dto.amperage ?? 0,
    type: dto.fuse_type ?? "Blade",
    color: dto.color ?? "#cccccc",
  };
};

export const toPartEntities = (dtos: PartDTO[]): Part[] => dtos.map(toPartEntity);
