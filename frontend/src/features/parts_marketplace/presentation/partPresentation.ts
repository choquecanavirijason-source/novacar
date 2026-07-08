/**
 * Presentation · helpers del marketplace.
 * Mapea valores del dominio a iconos y a CLAVES de traducción (i18n).
 */

import type { PartCategory, PartCondition } from "../domain/entities/MarketplacePart";

export const categoryIcon: Record<PartCategory, string> = {
  engine: "⚙️",
  tires: "🛞",
  seats: "🪑",
  battery: "🔋",
  fuse: "🔌",
  brakes: "🛑",
  suspension: "🔩",
  oil: "🛢️",
  lights: "💡",
  filters: "🌀",
  body: "🚪",
  audio: "🔊",
};

export const categoryKey = (c: PartCategory): string => `partCat.${c}`;
export const conditionKey = (c: PartCondition): string => `cond.${c}`;
