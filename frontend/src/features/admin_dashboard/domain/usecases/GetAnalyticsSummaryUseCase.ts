/**
 * Domain · Use Case · GetAnalyticsSummary
 */

import type { AnalyticsSummary } from "../entities/DashboardStats";
import type { AdminRepository } from "../repositories/AdminRepository";

export class GetAnalyticsSummaryUseCase {
  constructor(private readonly repository: AdminRepository) {}

  execute(): Promise<AnalyticsSummary> {
    return this.repository.getAnalyticsSummary();
  }
}
