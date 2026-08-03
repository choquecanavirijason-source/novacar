/**
 * Domain · Repository Contract · MarketplaceRepository
 */

import type { MarketplacePart, NewMarketplacePart } from "../entities/MarketplacePart";

export interface MarketplaceRepository {
  getAll(): Promise<MarketplacePart[]>;
  getById(id: string): Promise<MarketplacePart | null>;
  createPart(input: NewMarketplacePart): Promise<MarketplacePart>;
  updatePart(id: string, input: NewMarketplacePart): Promise<MarketplacePart>;
  deletePart(id: string): Promise<void>;
}
