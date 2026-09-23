<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * `TEXT` de MySQL tiene un límite de ~64 KB — insuficiente para las fotos que
 * sube el admin vía ImageUrlField, que se guardan como data URL en base64
 * (una foto de celular fácilmente supera eso). `catalog_vehicles.image_url`
 * ya usaba `LONGTEXT` (hasta 4 GB) desde su creación; esta migración alinea
 * `marketplace_parts.image_url` al mismo tipo. Se usa SQL crudo porque
 * `Blueprint::change()` requiere doctrine/dbal, no instalado en este proyecto.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE marketplace_parts MODIFY image_url LONGTEXT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE marketplace_parts MODIFY image_url TEXT NULL');
    }
};
