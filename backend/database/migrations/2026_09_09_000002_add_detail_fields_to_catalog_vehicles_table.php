<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * El panel admin (VehicleFormModal) y la ficha de detalle del catálogo
     * manejan estos campos desde el día uno vía el mock de localStorage,
     * pero la tabla nunca los tuvo — de ahí el 404/mismatch al pegar el
     * formulario al backend real.
     */
    public function up(): void
    {
        Schema::table('catalog_vehicles', function (Blueprint $table) {
            // longText: el campo llega como Data URL (base64) desde
            // ImageUrlField, no como URL corta — un varchar se quedaría corto.
            $table->longText('image_url')->nullable()->after('accent_to');
            $table->string('color')->nullable();
            $table->unsignedTinyInteger('doors')->nullable();
            $table->unsignedTinyInteger('cylinders')->nullable();
            $table->string('displacement')->nullable();
            $table->string('drive_type')->nullable();
            $table->string('title_code')->nullable();
            $table->string('sale_date')->nullable();
            $table->string('sale_time')->nullable();
            $table->string('sale_location')->nullable();
            $table->boolean('has_keys')->default(true);
            $table->string('damage_type')->nullable();
            $table->string('damage_severity')->default('none');
            $table->text('damage_description')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('run_and_drive')->default(true);
            $table->json('highlights')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('catalog_vehicles', function (Blueprint $table) {
            $table->dropColumn([
                'image_url', 'color', 'doors', 'cylinders', 'displacement',
                'drive_type', 'title_code', 'sale_date', 'sale_time', 'sale_location',
                'has_keys', 'damage_type', 'damage_severity', 'damage_description',
                'notes', 'run_and_drive', 'highlights',
            ]);
        });
    }
};
