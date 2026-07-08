/**
 * Composition Root del módulo `search_vehicle_parts`.
 */

import { createApiClient } from "@core/http/createApiClient";
import { GetCompatiblePartsUseCase } from "./domain/usecases/GetCompatiblePartsUseCase";
import { GetVehicleOptionsUseCase } from "./domain/usecases/GetVehicleOptionsUseCase";
import { CalculateBatteryAmperageUseCase } from "./domain/usecases/CalculateBatteryAmperageUseCase";
import { SearchRepositoryImpl } from "./data/repositories/SearchRepositoryImpl";
import {
  SearchHttpDataSource,
  SearchMockDataSource,
} from "./data/datasources/SearchRemoteDataSource";

const useHttp = process.env.NEXT_PUBLIC_USE_API === "true";
const dataSource = useHttp
  ? new SearchHttpDataSource(createApiClient())
  : new SearchMockDataSource();

const repository = new SearchRepositoryImpl(dataSource);

export const searchUseCases = {
  getCompatibleParts: new GetCompatiblePartsUseCase(repository),
  getVehicleOptions: new GetVehicleOptionsUseCase(repository),
  calculateBatteryAmperage: new CalculateBatteryAmperageUseCase(),
} as const;