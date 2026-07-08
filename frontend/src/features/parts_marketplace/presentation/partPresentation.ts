/**
 * Presentation · helpers del marketplace.
 * Mapea valores del dominio a iconos (lucide-react) y a CLAVES de traducción (i18n).
 */

import type { LucideIcon } from "lucide-react";
import {
  Cog,
  Disc,
  Armchair,
  BatteryCharging,
  Zap,
  Disc2,
  ArrowUpDown,
  Droplet,
  Lightbulb,
  Filter,
  DoorOpen,
  Volume2,
} from "lucide-react";
import type { PartCategory, PartCondition } from "../domain/entities/MarketplacePart";

export const categoryIcon: Record<PartCategory, LucideIcon> = {
  engine: Cog,
  tires: Disc,
  seats: Armchair,
  battery: BatteryCharging,
  fuse: Zap,
  brakes: Disc2,
  suspension: ArrowUpDown,
  oil: Droplet,
  lights: Lightbulb,
  filters: Filter,
  body: DoorOpen,
  audio: Volume2,
};

export const categoryKey = (c: PartCategory): string => `partCat.${c}`;
export const conditionKey = (c: PartCondition): string => `cond.${c}`;
