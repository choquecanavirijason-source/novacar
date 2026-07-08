/**
 * Composition Root del módulo `vehicles_catalog`.
 */

import { createApiClient } from "@core/http/createApiClient";
import {
  CatalogHttpDataSource,
  CatalogMockDataSource,
} from "./data/datasources/CatalogRemoteDataSource";
import { CatalogRepositoryImpl } from "./data/repositories/CatalogRepositoryImpl";
import { GetFeaturedVehiclesUseCase } from "./domain/usecases/GetFeaturedVehiclesUseCase";
import { FilterVehiclesUseCase } from "./domain/usecases/FilterVehiclesUseCase";
import { GetVehicleByIdUseCase } from "./domain/usecases/GetVehicleByIdUseCase";

const useHttp = process.env.NEXT_PUBLIC_USE_API === "true";
const dataSource = useHttp
  ? new CatalogHttpDataSource(createApiClient())
  : new CatalogMockDataSource();

const repository = new CatalogRepositoryImpl(dataSource);

export const catalogUseCases = {
  getFeaturedVehicles: new GetFeaturedVehiclesUseCase(repository),
  filterVehicles: new FilterVehiclesUseCase(repository),
  getVehicleById: new GetVehicleByIdUseCase(repository),
} as const;