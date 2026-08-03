/**
 * Domain · Use Case · UpdatePart
 */

import type { MarketplacePart, NewMarketplacePart } from "../entities/MarketplacePart";
import type { MarketplaceRepository } from "../repositories/MarketplaceRepository";

export class UpdatePartUseCase {
  constructor(private readonly repository: MarketplaceRepository) {}

  execute(id: string, input: NewMarketplacePart): Promise<MarketplacePart> {
    if (!input.name.trim()) {
      throw new Error("El nombre es obligatorio.");
    }
    if (input.price <= 0) {
      throw new Error("El precio debe ser mayor a 0.");
    }
    return this.repository.updatePart(id, input);
  }
}
