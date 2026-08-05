/**
 * Composition Root del módulo `quote_requests`.
 */

import { QuoteRequestHttpDataSource, QuoteRequestMockDataSource } from "./data/datasources/QuoteRequestRemoteDataSource";
import { QuoteRequestRepositoryImpl } from "./data/repositories/QuoteRequestRepositoryImpl";
import { GetQuoteRequestsUseCase } from "./domain/usecases/GetQuoteRequestsUseCase";
import { CreateQuoteRequestUseCase } from "./domain/usecases/CreateQuoteRequestUseCase";
import { UpdateQuoteRequestStatusUseCase } from "./domain/usecases/UpdateQuoteRequestStatusUseCase";
import { DeleteQuoteRequestUseCase } from "./domain/usecases/DeleteQuoteRequestUseCase";

const useHttp = process.env.NEXT_PUBLIC_USE_API === "true";
const dataSource = useHttp ? new QuoteRequestHttpDataSource() : new QuoteRequestMockDataSource();

const repository = new QuoteRequestRepositoryImpl(dataSource);

export const quoteRequestUseCases = {
  getQuoteRequests: new GetQuoteRequestsUseCase(repository),
  createQuoteRequest: new CreateQuoteRequestUseCase(repository),
  updateQuoteRequestStatus: new UpdateQuoteRequestStatusUseCase(repository),
  deleteQuoteRequest: new DeleteQuoteRequestUseCase(repository),
} as const;
