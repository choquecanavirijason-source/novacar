/**
 * Composition Root del módulo `parts_marketplace`.
 */

import { createApiClient } from "@core/http/createApiClient";
import {
  MarketplaceHttpDataSource,
  MarketplaceMockDataSource,
} from "./data/datasources/MarketplaceRemoteDataSource";
import { MarketplaceRepositoryImpl } from "./data/repositories/MarketplaceRepositoryImpl";
import { SearchPartsUseCase } from "./domain/usecases/SearchPartsUseCase";
import { GetPartFacetsUseCase } from "./domain/usecases/GetPartFacetsUseCase";
import { GetPartByIdUseCase } from "./domain/usecases/GetPartByIdUseCase";

const useHttp = process.env.NEXT_PUBLIC_USE_API === "true";
const dataSource = useHttp
  ? new MarketplaceHttpDataSource(createApiClient())
  : new MarketplaceMockDataSource();

const repository = new MarketplaceRepositoryImpl(dataSource);

export const marketplaceUseCases = {
  searchParts: new SearchPartsUseCase(repository),
  getFacets: new GetPartFacetsUseCase(repository),
  getPartById: new GetPartByIdUseCase(repository),
} as const;