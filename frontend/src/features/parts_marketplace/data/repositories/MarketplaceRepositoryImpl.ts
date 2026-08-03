/**
 * Data · Repository · MarketplaceRepositoryImpl
 */

import type { MarketplacePart, NewMarketplacePart } from "../../domain/entities/MarketplacePart";
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

  async createPart(input: NewMarketplacePart): Promise<MarketplacePart> {
    return toMarketplacePart(await this.remote.create(input));
  }

  async updatePart(id: string, input: NewMarketplacePart): Promise<MarketplacePart> {
    return toMarketplacePart(await this.remote.update(id, input));
  }

  deletePart(id: string): Promise<void> {
    return this.remote.remove(id);
  }
}
