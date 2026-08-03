/**
 * Domain · Repository Contract · BannerRepository
 */

import type { Banner, NewBanner } from "../entities/Banner";

export interface BannerRepository {
  getBanners(): Promise<Banner[]>;
  getActiveBanners(): Promise<Banner[]>;
  createBanner(input: NewBanner): Promise<Banner>;
  updateBanner(id: string, input: NewBanner): Promise<Banner>;
  toggleBannerActive(id: string, active: boolean): Promise<Banner>;
  deleteBanner(id: string): Promise<void>;
  reorderBanners(orderedIds: string[]): Promise<Banner[]>;
}
