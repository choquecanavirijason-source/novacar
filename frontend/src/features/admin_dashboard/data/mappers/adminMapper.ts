/**
 * Data · Mapper · adminMapper
 * Funciones puras: DTO (transporte) -> Entity (dominio). Desacoplamiento total.
 */

import type { AnalyticsSummary } from "../../domain/entities/DashboardStats";
import type { InventoryItem } from "../../domain/entities/InventoryItem";
import type { InventoryItemDTO } from "../models/InventoryItemDTO";
import type { AnalyticsSummaryDTO } from "../models/AnalyticsSummaryDTO";

export const mapInventory = (dto: InventoryItemDTO): InventoryItem => ({
  id: dto.id,
  sku: dto.sku,
  name: dto.name,
  category: dto.category,
  stock: dto.stock,
  price: dto.price,
  reorderLevel: dto.reorder_level,
});

export const mapAnalytics = (dto: AnalyticsSummaryDTO): AnalyticsSummary => ({
  stats: {
    totalVehicles: dto.stats.total_vehicles,
    totalParts: dto.stats.total_parts,
    lowStockCount: dto.stats.low_stock_count,
    monthlyRevenue: dto.stats.monthly_revenue,
  },
  topSellingParts: dto.top_selling_parts,
});
