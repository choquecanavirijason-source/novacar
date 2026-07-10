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

const categoryPhotoKeyword: Record<PartCategory, string> = {
  engine: "engine",
  tires: "tire",
  seats: "car-seat",
  battery: "battery",
  fuse: "fusebox",
  brakes: "brakedisc",
  suspension: "suspension",
  oil: "motoroil",
  lights: "headlight",
  filters: "airfilter",
  body: "cardoor",
  audio: "carspeaker",
};

/**
 * URL de foto real de placeholder (a reemplazar por assets propios), con
 * semilla estable por id para que la misma tarjeta muestre siempre la misma
 * imagen. Da a las tarjetas de autopartes el mismo tratamiento visual
 * (pop-out de imagen real) que las tarjetas de autos.
 */
export const partPhotoUrl = (
  id: string,
  category: PartCategory,
  size: { w: number; h: number } = { w: 480, h: 360 },
): string => {
  const seed = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const keywords = encodeURIComponent(`autoparts,${categoryPhotoKeyword[category]}`);
  return `https://loremflickr.com/${size.w}/${size.h}/${keywords}?lock=${seed}`;
};
