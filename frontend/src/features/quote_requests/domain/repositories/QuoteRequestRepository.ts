/**
 * Domain · Repository Contract · QuoteRequestRepository
 */

import type { NewQuoteRequest, QuoteRequest, QuoteStatus } from "../entities/QuoteRequest";

export interface QuoteRequestRepository {
  getQuoteRequests(): Promise<QuoteRequest[]>;
  createQuoteRequest(input: NewQuoteRequest): Promise<QuoteRequest>;
  updateQuoteRequestStatus(id: string, status: QuoteStatus): Promise<QuoteRequest>;
  deleteQuoteRequest(id: string): Promise<void>;
}
