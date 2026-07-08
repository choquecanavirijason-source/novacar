/**
 * Data · Repository · MarketplaceRepositoryImpl
 */

import type { MarketplacePart } from "../../domain/entities/MarketplacePart";
import type { MarketplaceRepository } from "../../domain/repositories/MarketplaceRepository";
import { toMarketplacePart, toMarketplaceParts } from "../mappers/partMapper";
import type { MarketplaceRemoteDataSource } from "../datasources/MarketplaceRemoteDataSource";

export class MarketplaceRepositoryImpl implements MarketplaceRepository {
  constructor(private readonly remote: MarketplaceRemoteDataSource) {}

  async getAll(): Promise<MarketplacePart[]> {
    return toMarketplaceParts(await this.remote.fetchAll());
  }

  async getById(id: string): Promise<MarketplacePart | null> {
    const dto = await this.remote.fetchById(id);
    return dto ? toMarketplacePart(dto) : null;
  }
}
