/**
 * Página de Ubicaciones - Novacar
 * Muestra las sucursales principales: Cochabamba y Santa Cruz
 * Con información de contacto, horarios y servicios
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  Navigation, 
  Building2,
  Car,
  Store,
  Wifi,
  Coffee,
  Shield,
  Users,
  ChevronRight,
  Star
} from "lucide-react";
import { useTranslation } from "@core/i18n/I18nProvider";
import { Breadcrumbs } from "@ui/molecules/Breadcrumbs";

// Interfaces para las ubicaciones
interface LocationHours {
  day: string;
  open: string;
  close: string;
  isClosed?: boolean;
}

interface LocationService {
  icon: React.ReactNode;
  label: string;
  description?: string;
}

interface Location {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: LocationHours[];
  services: LocationService[];
  image: string;
  featured?: boolean;
  distance?: string;
  rating?: number;
  reviews?: number;
  manager?: string;
  description?: string;
}

// Datos de las ubicaciones
const LOCATIONS: Location[] = [
  {
    id: "cochabamba",
    name: "Novacar Cochabamba",
    city: "Cochabamba",
    address: "C. Atacama 1447, Cochabamba",
    phone: "+591 4 1234567",
    email: "cochabamba@novacar.com",
    coordinates: {
      lat: -17.3801376,
      lng: -66.1781788
    },
    image: "/vehicles/logo-cochabamba.png",
    featured: true,
    rating: 4.8,
    reviews: 124,
    manager: "Carlos Mendoza",
    description: "Nuestra sucursal principal en Cochabamba, con el más amplio showroom de vehículos y taller especializado.",
    hours: [
      { day: "Lunes a Viernes", open: "08:00", close: "19:00" },
      { day: "Sábado", open: "09:00", close: "18:00" },
      { day: "Domingo", open: "09:00", close: "13:00" },
    ],
    services: [
      {
        icon: <Car className="w-5 h-5" />,
        label: "Showroom de vehículos",
        description: "Más de 50 vehículos en exhibición"
      },
      {
        icon: <Wifi className="w-5 h-5" />,
        label: "WiFi gratuito",
        description: "Para nuestros clientes"
      },
      {
        icon: <Coffee className="w-5 h-5" />,
        label: "Cafetería",
        description: "Bebidas y snacks"
      },
      {
        icon: <Shield className="w-5 h-5" />,
        label: "Taller especializado",
        description: "Mantenimiento y reparaciones"
      },
    ]
  },
  {
    id: "santa-cruz",
    name: "Novacar Santa Cruz",
    city: "Santa Cruz de la Sierra",
    address: "Av. San Martín #567, Zona Equipetrol, Santa Cruz",
    phone: "+591 3 7654321",
    email: "santacruz@novacar.com",
    coordinates: {
      lat: -17.7837,
      lng: -63.1821
    },
    image: "/vehicles/logo-santa-cruz.png",
    featured: true,
    rating: 4.9,
    reviews: 98,
    manager: "Ana Rodríguez",
    description: "Nuestra sucursal en Santa Cruz, con el mejor servicio postventa y atención personalizada.",
    hours: [
      { day: "Lunes a Viernes", open: "08:30", close: "19:30" },
      { day: "Sábado", open: "09:00", close: "17:00" },
      { day: "Domingo", open: "09:00", close: "12:00" },
    ],
    services: [
      {
        icon: <Car className="w-5 h-5" />,
        label: "Showroom de vehículos",
        description: "Vehículos nuevos y seminuevos"
      },
      {
        icon: <Users className="w-5 h-5" />,
        label: "Asesoría personalizada",
        description: "Atención uno a uno"
      },
      {
        icon: <Store className="w-5 h-5" />,
        label: "Tienda de accesorios",
        description: "Todo para tu vehículo"
      },
      {
        icon: <Calendar className="w-5 h-5" />,
        label: "Servicio de citas",
        description: "Agenda tu visita"
      },
    ]
  }
];

// Componente de tarjeta de ubicación
function LocationCard({ location, t }: { location: Location; t: any }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`
      group relative bg-(--bg-card) rounded-2xl overflow-hidden 
      border border-white/5 hover:border-(--accent-neon)/30 
      transition-all duration-300 hover:shadow-2xl hover:shadow-(--accent-neon)/5
      ${location.featured ? 'ring-2 ring-(--accent-neon)/20' : ''}
    `}>
      {/* Badge de destacado */}
      {location.featured && (
        <div className="absolute top-4 right-4 z-10 bg-(--accent-neon) text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Star className="w-3 h-3 fill-current" />
          {t("ubicaciones.featured")}
        </div>
      )}

      {/* Imagen de la ubicación */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
        <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
          {location.image && !imageError ? (
            <Image
              src={location.image}
              alt={location.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-600">
              <Building2 className="w-16 h-16 mb-2 opacity-30" />
              <span className="text-sm opacity-30">Sin imagen</span>
            </div>
          )}
        </div>
        {/* Overlay con información rápida */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between text-white">
          <div>
            <h3 className="text-xl font-bold">{location.name}</h3>
            <p className="text-sm opacity-90 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {location.city}
            </p>
          </div>
          {location.rating && (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{location.rating}</span>
              <span className="opacity-70">({location.reviews})</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 space-y-4">
        {/* Descripción */}
        {location.description && (
          <p className="text-sm text-gray-400">{location.description}</p>
        )}

        {/* Grid de información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Información de contacto */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {t("ubicaciones.contact")}
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 shrink-0 text-(--accent-neon)" />
                <span>{location.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="w-4 h-4 shrink-0 text-(--accent-neon)" />
                <a href={`tel:${location.phone}`} className="hover:text-(--accent-neon) transition-colors">
                  {location.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="w-4 h-4 shrink-0 text-(--accent-neon)" />
                <a href={`mailto:${location.email}`} className="hover:text-(--accent-neon) transition-colors">
                  {location.email}
                </a>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {t("ubicaciones.schedule")}
            </h4>
            <div className="space-y-1 text-sm">
              {location.hours.map((hour, idx) => (
                <div key={idx} className="flex justify-between text-gray-300">
                  <span className="text-gray-400">{hour.day}</span>
                  <span>
                    {hour.isClosed ? (
                      <span className="text-red-400">{t("ubicaciones.closed")}</span>
                    ) : (
                      `${hour.open} - ${hour.close}`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Servicios */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
            {t("ubicaciones.services")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {location.services.map((service, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 text-xs text-gray-300"
              >
                {service.icon}
                <span>{service.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          <a
            href={`https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm bg-(--accent-neon)/10 hover:bg-(--accent-neon)/20 text-(--accent-neon) px-4 py-2 rounded-lg transition-colors"
          >
            <Navigation className="w-4 h-4" />
            {t("ubicaciones.getDirections")}
          </a>
          <a
            href={`tel:${location.phone}`}
            className="flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors text-white"
          >
            <Phone className="w-4 h-4" />
            {t("ubicaciones.callUs")}
          </a>
        </div>
      </div>
    </div>
  );
}

// Componente principal
export default function UbiPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-(--bg-base)">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs
          items={[
            { label: t("nav.home"), href: "/" },
            { label: t("ubicaciones.title") },
          ]}
        />
      </div>

      {/* Header - Con ícono adelante del título y efecto de parpadeo MÁS NOTORIO */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-4">
             
              <MapPin 
                className="
                  w-10  h-10 
                  md:w-16 md:h-16 
                  text-(--accent-neon) 
                  flex-shrink-0 
                  location-icon-pulse
                  hover:scale-110 
                  transition-all duration-300
                  drop-shadow-[0_0_15px_rgba(0,170,255,0.3)]
                " 
                strokeWidth={1.5} 
              />
              <span className="flex items-center gap-3">
                {t("ubicaciones.title")}
                <span className="text-sm md:text-base font-normal text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                  {LOCATIONS.length} {t("ubicaciones.locations")}
                </span>
              </span>
            </h1>
            <p className="text-gray-400 mt-3 text-base md:text-lg">
              {t("ubicaciones.subtitle")}
            </p>
            {/* ✅ TAGS DE CIUDADES SIN ÍCONOS */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {LOCATIONS.map((location) => (
                <span 
                  key={location.id}
                  className="text-sm text-gray-400 bg-white/5 px-4 py-1.5 rounded-full"
                >
                  {location.city}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {t("ubicaciones.openNow")}
            </span>
          </div>
        </div>
      </div>

      {/* Grid de ubicaciones */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {LOCATIONS.map((location) => (
            <LocationCard key={location.id} location={location} t={t} />
          ))}
        </div>
      </div>

      {/* Sección de preguntas frecuentes */}
      <div className="container mx-auto px-4 py-12 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            {t("ubicaciones.faqTitle")}
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            {t("ubicaciones.faqSubtitle")}
          </p>
          <Link
            href={{ pathname: "/contacto" }}
            className="inline-flex items-center gap-2 text-(--accent-neon) hover:gap-3 transition-all"
          >
            {t("ubicaciones.contactUs")}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}