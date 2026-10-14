<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Punto de entrada de `php artisan db:seed`.
 *
 * El orden importa: las cuentas se crean antes que los banners (que guardan su
 * autor) y los vehículos antes que las cotizaciones (que pueden referenciarlos).
 *
 * `WithoutModelEvents` evita disparar los eventos de dominio durante la siembra:
 * sembrar 24 autopartes no debe encolar 24 avisos de stock bajo.
 */
class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CatalogVehicleSeeder::class,
            MarketplacePartSeeder::class,
            BannerSeeder::class,
            QuoteRequestSeeder::class,
            LegacyCatalogSeeder::class,
        ]);
    }
}
