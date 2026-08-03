/**
 * Domain · Use Case · GetActiveBanners
 * Banners visibles en el sitio público, ya ordenados.
 */

import type { Banner } from "../entities/Banner";
import type { BannerRepository } from "../repositories/BannerRepository";

export class GetActiveBannersUseCase {
  constructor(private readonly repository: BannerRepository) {}

  execute(): Promise<Banner[]> {
    return this.repository.getActiveBanners();
  }
}
