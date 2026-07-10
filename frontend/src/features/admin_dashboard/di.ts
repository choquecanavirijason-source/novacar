/**
 * Composition Root del módulo `admin_dashboard`.
 */

import {
  AdminHttpDataSource,
  AdminMockDataSource,
} from "./data/datasources/AdminRemoteDataSource";
import { AdminRepositoryImpl } from "./data/repositories/AdminRepositoryImpl";
import { GetAnalyticsSummaryUseCase } from "./domain/usecases/GetAnalyticsSummaryUseCase";
import { UpdateInventoryStockUseCase } from "./domain/usecases/UpdateInventoryStockUseCase";
import { CreateInventoryItemUseCase } from "./domain/usecases/CreateInventoryItemUseCase";

const useHttp = process.env.NEXT_PUBLIC_USE_API === "true";
const dataSource = useHttp ? new AdminHttpDataSource() : new AdminMockDataSource();

const repository = new AdminRepositoryImpl(dataSource);

export const adminUseCases = {
  getAnalyticsSummary: new GetAnalyticsSummaryUseCase(repository),
  updateInventoryStock: new UpdateInventoryStockUseCase(repository),
  createInventoryItem: new CreateInventoryItemUseCase(repository),
  getInventory: () => repository.getInventory(),
} as const;