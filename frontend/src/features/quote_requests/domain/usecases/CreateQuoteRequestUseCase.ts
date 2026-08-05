/**
 * Domain · Use Case · CreateQuoteRequest
 * Alta de una cotización/consulta enviada desde el sitio público.
 */

import type { NewQuoteRequest, QuoteRequest } from "../entities/QuoteRequest";
import type { QuoteRequestRepository } from "../repositories/QuoteRequestRepository";

export class CreateQuoteRequestUseCase {
  constructor(private readonly repository: QuoteRequestRepository) {}

  execute(input: NewQuoteRequest): Promise<QuoteRequest> {
    if (!input.customerEmail.trim()) {
      throw new Error("El correo del cliente es obligatorio.");
    }
    if (!input.subject.trim()) {
      throw new Error("El asunto de la cotización es obligatorio.");
    }
    return this.repository.createQuoteRequest(input);
  }
}
