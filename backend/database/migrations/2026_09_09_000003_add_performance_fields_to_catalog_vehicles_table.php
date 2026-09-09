<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Velocidad máxima, aceleración 0-100 y disponibilidad — campos nuevos
     * que ahora captura VehicleFormModal (panel admin).
     */
    public function up(): void
    {
        Schema::table('catalog_vehicles', function (Blueprint $table) {
            $table->unsignedSmallInteger('top_speed_kmh')->default(0)->after('horsepower');
            $table->decimal('zero_to_hundred_sec', 4, 1)->default(0)->after('top_speed_kmh');
            $table->string('availability')->default('disponible')->after('condition');
        });
    }

    public function down(): void
    {
        Schema::table('catalog_vehicles', function (Blueprint $table) {
            $table->dropColumn(['top_speed_kmh', 'zero_to_hundred_sec', 'availability']);
        });
    }
};
