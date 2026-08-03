/**
 * Domain · Use Case · ReorderBanners
 */

import type { Banner } from "../entities/Banner";
import type { BannerRepository } from "../repositories/BannerRepository";

export class ReorderBannersUseCase {
  constructor(private readonly repository: BannerRepository) {}

  execute(orderedIds: string[]): Promise<Banner[]> {
    return this.repository.reorderBanners(orderedIds);
  }
}
