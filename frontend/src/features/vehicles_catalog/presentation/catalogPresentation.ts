// src/features/vehicles_catalog/presentation/catalogPresentation.ts
import type { CatalogVehicle } from "../domain/entities/CatalogVehicle";

/**
 * Mapeo de imágenes por vehículo usando Unsplash
 */
const VEHICLE_IMAGES: Record<string, string> = {
  // Nissan
  "nissan-versa-2021": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&crop=center",
  "nissan-altima-2022": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&crop=center",
  
  // Volkswagen
  "vw-jetta-2022": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center",
  "vw-golf-2023": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center",
  
  // Toyota
  "toyota-corolla-2023": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&crop=center",
  "toyota-camry-2023": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&crop=center",
  
  // Tesla
  "tesla-model3-2023": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center",
  
  // BMW
  "bmw-e46-m3-2004": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center",
  "bmw-f650gs-2023": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&h=600&fit=crop&crop=center",
};

/**
 * Obtiene la URL de la imagen para un vehículo
 */
export function getVehicleImageUrl(vehicle: CatalogVehicle | { id: string; brand: string; model: string }): string {
  // Si tiene imageUrl propio, usarlo
  if ('imageUrl' in vehicle && vehicle.imageUrl) {
    return vehicle.imageUrl;
  }
  
  // Buscar por ID exacto
  if (VEHICLE_IMAGES[vehicle.id]) {
    return VEHICLE_IMAGES[vehicle.id];
  }
  
  // Si no encuentra, usar imagen por marca
  const brandImages: Record<string, string> = {
    'Nissan': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&crop=center',
    'Volkswagen': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&crop=center',
    'Toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&crop=center',
    'Tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop&crop=center',
    'BMW': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&crop=center',
  };
  
  if (brandImages[vehicle.brand]) {
    return brandImages[vehicle.brand];
  }
  
  // Imagen por defecto
  return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&crop=center';
}

export { VEHICLE_IMAGES };