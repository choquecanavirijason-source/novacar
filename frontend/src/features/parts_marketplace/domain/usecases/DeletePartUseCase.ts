/**
 * Domain · Use Case · DeletePart
 */

import type { MarketplaceRepository } from "../repositories/MarketplaceRepository";

export class DeletePartUseCase {
  constructor(private readonly repository: MarketplaceRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.deletePart(id);
  }
}
