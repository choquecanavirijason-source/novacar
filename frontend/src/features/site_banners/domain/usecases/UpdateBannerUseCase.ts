/**
 * Domain · Use Case · UpdateBanner
 */

import type { Banner, NewBanner } from "../entities/Banner";
import type { BannerRepository } from "../repositories/BannerRepository";

export class UpdateBannerUseCase {
  constructor(private readonly repository: BannerRepository) {}

  execute(id: string, input: NewBanner): Promise<Banner> {
    if (!input.title.trim()) {
      throw new Error("El título es obligatorio.");
    }
    if (!input.imageUrl.trim()) {
      throw new Error("La imagen es obligatoria.");
    }
    if (!input.href.trim()) {
      throw new Error("El enlace de destino es obligatorio.");
    }
    return this.repository.updateBanner(id, input);
  }
}
