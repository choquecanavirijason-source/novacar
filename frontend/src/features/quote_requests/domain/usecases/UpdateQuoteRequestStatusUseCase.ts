/**
 * Domain · Use Case · UpdateQuoteRequestStatus
 * El admin mueve la cotización por su ciclo de vida: nueva → contactada → cerrada.
 */

import type { QuoteRequest, QuoteStatus } from "../entities/QuoteRequest";
import type { QuoteRequestRepository } from "../repositories/QuoteRequestRepository";

export class UpdateQuoteRequestStatusUseCase {
  constructor(private readonly repository: QuoteRequestRepository) {}

  execute(id: string, status: QuoteStatus): Promise<QuoteRequest> {
    return this.repository.updateQuoteRequestStatus(id, status);
  }
}
