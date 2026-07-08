/**
 * Domain · Entity · DashboardStats
 * Métricas agregadas del panel administrativo.
 */

export interface DashboardStats {
  readonly totalVehicles: number;
  readonly totalParts: number;
  readonly lowStockCount: number;
  readonly monthlyRevenue: number;
}

export interface AnalyticsSummary {
  readonly stats: DashboardStats;
  readonly topSellingParts: ReadonlyArray<{ name: string; units: number }>;
}
