/**
 * Data · Mapper · quoteRequestMapper
 * DTO (snake_case, red) <-> Entity (camelCase, dominio).
 */

import type { NewQuoteRequest, QuoteRequest } from "../../domain/entities/QuoteRequest";
import type { QuoteRequestDTO } from "../models/QuoteRequestDTO";

export function mapQuoteRequest(dto: QuoteRequestDTO): QuoteRequest {
  return {
    id: dto.id,
    source: dto.source,
    customerEmail: dto.customer_email,
    subject: dto.subject,
    details: dto.details,
    amount: dto.amount,
    status: dto.status,
    createdAt: dto.created_at,
  };
}

export function toQuoteRequestPayload(input: NewQuoteRequest) {
  return {
    source: input.source,
    customer_email: input.customerEmail,
    subject: input.subject,
    details: input.details,
    amount: input.amount,
  };
}
