/**
 * Composition Root del módulo `site_banners`.
 */

import { BannerHttpDataSource, BannerMockDataSource } from "./data/datasources/BannerRemoteDataSource";
import { BannerRepositoryImpl } from "./data/repositories/BannerRepositoryImpl";
import { GetBannersUseCase } from "./domain/usecases/GetBannersUseCase";
import { GetActiveBannersUseCase } from "./domain/usecases/GetActiveBannersUseCase";
import { CreateBannerUseCase } from "./domain/usecases/CreateBannerUseCase";
import { UpdateBannerUseCase } from "./domain/usecases/UpdateBannerUseCase";
import { DeleteBannerUseCase } from "./domain/usecases/DeleteBannerUseCase";
import { ToggleBannerActiveUseCase } from "./domain/usecases/ToggleBannerActiveUseCase";
import { ReorderBannersUseCase } from "./domain/usecases/ReorderBannersUseCase";

const useHttp = process.env.NEXT_PUBLIC_USE_API === "true";
const dataSource = useHttp ? new BannerHttpDataSource() : new BannerMockDataSource();

const repository = new BannerRepositoryImpl(dataSource);

export const bannerUseCases = {
  getBanners: new GetBannersUseCase(repository),
  getActiveBanners: new GetActiveBannersUseCase(repository),
  createBanner: new CreateBannerUseCase(repository),
  updateBanner: new UpdateBannerUseCase(repository),
  deleteBanner: new DeleteBannerUseCase(repository),
  toggleBannerActive: new ToggleBannerActiveUseCase(repository),
  reorderBanners: new ReorderBannersUseCase(repository),
} as const;
