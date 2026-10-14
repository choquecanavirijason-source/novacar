<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Banners promocionales del home, gestionados desde el panel (?tab=banners).
 *
 * `sort_order` guarda la posición manual (flechas arriba/abajo de la tabla);
 * se expone al frontend como `order` desde el BannerResource.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('title');
            $table->string('subtitle')->default('');
            $table->longText('image_url')->nullable();
            $table->string('cta_label')->default('Ver más');
            $table->string('href')->default('/');
            $table->string('accent_from', 32)->default('#005f8f');
            $table->string('accent_to', 32)->default('#00aaff');
            $table->boolean('active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            // El home pide los activos ya ordenados: índice compuesto exacto.
            $table->index(['active', 'sort_order'], 'banners_active_sort_order_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
