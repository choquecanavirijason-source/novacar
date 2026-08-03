/**
 * Data · Repository · BannerRepositoryImpl
 */

import type { Banner, NewBanner } from "../../domain/entities/Banner";
import type { BannerRepository } from "../../domain/repositories/BannerRepository";
import type { BannerRemoteDataSource } from "../datasources/BannerRemoteDataSource";

export class BannerRepositoryImpl implements BannerRepository {
  constructor(private readonly remote: BannerRemoteDataSource) {}

  getBanners(): Promise<Banner[]> {
    return this.remote.fetchAll();
  }

  getActiveBanners(): Promise<Banner[]> {
    return this.remote.fetchActive();
  }

  createBanner(input: NewBanner): Promise<Banner> {
    return this.remote.create(input);
  }

  updateBanner(id: string, input: NewBanner): Promise<Banner> {
    return this.remote.update(id, input);
  }

  toggleBannerActive(id: string, active: boolean): Promise<Banner> {
    return this.remote.toggleActive(id, active);
  }

  deleteBanner(id: string): Promise<void> {
    return this.remote.remove(id);
  }

  reorderBanners(orderedIds: string[]): Promise<Banner[]> {
    return this.remote.reorder(orderedIds);
  }
}
