/**
 * Domain · Use Case · DeleteQuoteRequest
 */

import type { QuoteRequestRepository } from "../repositories/QuoteRequestRepository";

export class DeleteQuoteRequestUseCase {
  constructor(private readonly repository: QuoteRequestRepository) {}

  execute(id: string): Promise<void> {
    return this.repository.deleteQuoteRequest(id);
  }
}
