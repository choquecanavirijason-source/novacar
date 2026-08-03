/**
 * Domain · Use Case · CreatePart
 * Alta de una autoparte nueva en el marketplace. Valida campos mínimos.
 */

import type { MarketplacePart, NewMarketplacePart } from "../entities/MarketplacePart";
import type { MarketplaceRepository } from "../repositories/MarketplaceRepository";

export class CreatePartUseCase {
  constructor(private readonly repository: MarketplaceRepository) {}

  execute(input: NewMarketplacePart): Promise<MarketplacePart> {
    if (!input.name.trim()) {
      throw new Error("El nombre es obligatorio.");
    }
    if (!input.brand.trim()) {
      throw new Error("La marca es obligatoria.");
    }
    if (input.price <= 0) {
      throw new Error("El precio debe ser mayor a 0.");
    }
    return this.repository.createPart(input);
  }
}
