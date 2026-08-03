/**
 * Composition Root del módulo `admin_dashboard`.
 */

import {
  AdminHttpDataSource,
  AdminMockDataSource,
} from "./data/datasources/AdminRemoteDataSource";
import { AdminRepositoryImpl } from "./data/repositories/AdminRepositoryImpl";
import { UpdateInventoryStockUseCase } from "./domain/usecases/UpdateInventoryStockUseCase";
import { CreateInventoryItemUseCase } from "./domain/usecases/CreateInventoryItemUseCase";
import { UpdateInventoryItemUseCase } from "./domain/usecases/UpdateInventoryItemUseCase";
import { DeleteInventoryItemUseCase } from "./domain/usecases/DeleteInventoryItemUseCase";

const useHttp = process.env.NEXT_PUBLIC_USE_API === "true";
const dataSource = useHttp ? new AdminHttpDataSource() : new AdminMockDataSource();

const repository = new AdminRepositoryImpl(dataSource);

export const adminUseCases = {
  updateInventoryStock: new UpdateInventoryStockUseCase(repository),
  createInventoryItem: new CreateInventoryItemUseCase(repository),
  updateInventoryItem: new UpdateInventoryItemUseCase(repository),
  deleteInventoryItem: new DeleteInventoryItemUseCase(repository),
  getInventory: () => repository.getInventory(),
} as const;