/**
 * Domain · Use Case · ToggleBannerActive
 */

import type { Banner } from "../entities/Banner";
import type { BannerRepository } from "../repositories/BannerRepository";

export class ToggleBannerActiveUseCase {
  constructor(private readonly repository: BannerRepository) {}

  execute(id: string, active: boolean): Promise<Banner> {
    return this.repository.toggleBannerActive(id, active);
  }
}
