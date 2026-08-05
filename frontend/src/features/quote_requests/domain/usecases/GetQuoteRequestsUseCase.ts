/**
 * Domain · Use Case · GetQuoteRequests
 * Bandeja completa para el panel admin, más recientes primero.
 */

import type { QuoteRequest } from "../entities/QuoteRequest";
import type { QuoteRequestRepository } from "../repositories/QuoteRequestRepository";

export class GetQuoteRequestsUseCase {
  constructor(private readonly repository: QuoteRequestRepository) {}

  async execute(): Promise<QuoteRequest[]> {
    const requests = await this.repository.getQuoteRequests();
    return [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}
