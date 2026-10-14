<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Completa `catalog_vehicles` con la ficha extendida que ya consume el frontend
 * (CatalogVehicleDTO: color, puertas, cilindros, datos de subasta y de daños),
 * agrega borrado lógico e índices para los filtros del catálogo público.
 *
 * Todas las columnas nuevas traen default o son nullable para que las filas
 * existentes sobrevivan a la migración sin intervención manual.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('catalog_vehicles', function (Blueprint $table): void {
            // Las Data URL del ImageUrlField pesan cientos de KB: longText.
            $table->longText('image_url')->nullable();

            // Ficha extendida (motor / carrocería).
            $table->string('color')->default('No especificado');
            $table->unsignedTinyInteger('doors')->default(4);
            $table->unsignedTinyInteger('cylinders')->default(4);
            $table->string('displacement')->default('No especificado');
            $table->string('drive_type')->default('No especificado');

            // Datos de subasta / venta.
            $table->string('title_code')->default('No especificado');
            $table->date('sale_date')->nullable();
            $table->string('sale_time')->default('No especificado');
            $table->string('sale_location')->default('No especificado');
            $table->boolean('has_keys')->default(true);
            $table->boolean('run_and_drive')->default(true);

            // Estado físico.
            $table->string('damage_type')->default('Sin daños reportados');
            $table->string('damage_severity', 16)->default('none');
            $table->text('damage_description')->nullable();
            $table->text('notes')->nullable();
            $table->json('highlights')->nullable();

            $table->softDeletes();
        });

        Schema::table('catalog_vehicles', function (Blueprint $table): void {
            // Índices alineados con VehicleFilters del frontend.
            $table->index(['brand', 'model'], 'catalog_vehicles_brand_model_index');
            $table->index('body_type', 'catalog_vehicles_body_type_index');
            $table->index('fuel_type', 'catalog_vehicles_fuel_type_index');
            $table->index('condition', 'catalog_vehicles_condition_index');
            $table->index('price', 'catalog_vehicles_price_index');
            $table->index('year', 'catalog_vehicles_year_index');
            $table->index(['highlighted', 'created_at'], 'catalog_vehicles_highlighted_created_index');
        });
    }

    public function down(): void
    {
        Schema::table('catalog_vehicles', function (Blueprint $table): void {
            $table->dropIndex('catalog_vehicles_brand_model_index');
            $table->dropIndex('catalog_vehicles_body_type_index');
            $table->dropIndex('catalog_vehicles_fuel_type_index');
            $table->dropIndex('catalog_vehicles_condition_index');
            $table->dropIndex('catalog_vehicles_price_index');
            $table->dropIndex('catalog_vehicles_year_index');
            $table->dropIndex('catalog_vehicles_highlighted_created_index');
        });

        Schema::table('catalog_vehicles', function (Blueprint $table): void {
            $table->dropSoftDeletes();
            $table->dropColumn([
                'image_url', 'color', 'doors', 'cylinders', 'displacement', 'drive_type',
                'title_code', 'sale_date', 'sale_time', 'sale_location', 'has_keys',
                'run_and_drive', 'damage_type', 'damage_severity', 'damage_description',
                'notes', 'highlights',
            ]);
        });
    }
};
