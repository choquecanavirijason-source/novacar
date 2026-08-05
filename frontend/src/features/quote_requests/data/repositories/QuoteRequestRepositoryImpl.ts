/**
 * Data · Repository · QuoteRequestRepositoryImpl
 */

import type { NewQuoteRequest, QuoteRequest, QuoteStatus } from "../../domain/entities/QuoteRequest";
import type { QuoteRequestRepository } from "../../domain/repositories/QuoteRequestRepository";
import type { QuoteRequestRemoteDataSource } from "../datasources/QuoteRequestRemoteDataSource";

export class QuoteRequestRepositoryImpl implements QuoteRequestRepository {
  constructor(private readonly remote: QuoteRequestRemoteDataSource) {}

  getQuoteRequests(): Promise<QuoteRequest[]> {
    return this.remote.fetchAll();
  }

  createQuoteRequest(input: NewQuoteRequest): Promise<QuoteRequest> {
    return this.remote.create(input);
  }

  updateQuoteRequestStatus(id: string, status: QuoteStatus): Promise<QuoteRequest> {
    return this.remote.updateStatus(id, status);
  }

  deleteQuoteRequest(id: string): Promise<void> {
    return this.remote.remove(id);
  }
}
