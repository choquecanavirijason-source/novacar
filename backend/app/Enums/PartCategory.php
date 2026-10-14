<?php

declare(strict_types=1);

namespace App\Enums;

use App\Enums\Concerns\HasValues;

/** Las 12 categorías del marketplace de autopartes (espejo de PART_CATEGORIES). */
enum PartCategory: string
{
    use HasValues;

    case Engine = 'engine';
    case Tires = 'tires';
    case Seats = 'seats';
    case Battery = 'battery';
    case Fuse = 'fuse';
    case Brakes = 'brakes';
    case Suspension = 'suspension';
    case Oil = 'oil';
    case Lights = 'lights';
    case Filters = 'filters';
    case Body = 'body';
    case Audio = 'audio';

    public function label(): string
    {
        return match ($this) {
            self::Engine => 'Motores',
            self::Tires => 'Llantas',
            self::Seats => 'Asientos',
            self::Battery => 'Baterías',
            self::Fuse => 'Fusibles',
            self::Brakes => 'Frenos',
            self::Suspension => 'Suspensión',
            self::Oil => 'Aceites',
            self::Lights => 'Luces',
            self::Filters => 'Filtros',
            self::Body => 'Carrocería',
            self::Audio => 'Audio',
        };
    }

    /** Prefijo del SKU autogenerado cuando el admin no captura uno. */
    public function skuPrefix(): string
    {
        return strtoupper(substr($this->value, 0, 3));
    }
}
