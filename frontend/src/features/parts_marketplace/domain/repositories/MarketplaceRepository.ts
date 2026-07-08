/**
 * Domain · Repository Contract · MarketplaceRepository
 */

import type { MarketplacePart } from "../entities/MarketplacePart";

export interface MarketplaceRepository {
  getAll(): Promise<MarketplacePart[]>;
  getById(id: string): Promise<MarketplacePart | null>;
}
