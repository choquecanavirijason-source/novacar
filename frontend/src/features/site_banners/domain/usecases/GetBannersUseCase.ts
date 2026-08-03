/**
 * Domain · Use Case · GetBanners
 * Lista completa (activos e inactivos) para el panel admin.
 */

import type { Banner } from "../entities/Banner";
import type { BannerRepository } from "../repositories/BannerRepository";

export class GetBannersUseCase {
  constructor(private readonly repository: BannerRepository) {}

  execute(): Promise<Banner[]> {
    return this.repository.getBanners();
  }
}
