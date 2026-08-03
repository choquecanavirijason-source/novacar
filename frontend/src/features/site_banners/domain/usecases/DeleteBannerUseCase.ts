/**
 * Domain · Use Case · DeleteBanner
 */

import type { BannerRepository } from "../repositories/BannerRepository";

export class DeleteBannerUseCase {
  constructor(private readonly repository: BannerRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.deleteBanner(id);
  }
}
