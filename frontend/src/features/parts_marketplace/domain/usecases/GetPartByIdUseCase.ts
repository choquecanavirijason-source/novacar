/**
 * Domain · Use Case · GetPartById
 */

import type { MarketplacePart } from "../entities/MarketplacePart";
import type { MarketplaceRepository } from "../repositories/MarketplaceRepository";

export class GetPartByIdUseCase {
  constructor(private readonly repository: MarketplaceRepository) {}

  execute(id: string): Promise<MarketplacePart | null> {
    if (!id) return Promise.resolve(null);
    return this.repository.getById(id);
  }
}
