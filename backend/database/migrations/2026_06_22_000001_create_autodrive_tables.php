<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('operator')->after('email');
        });

        Schema::create('vehicle_fitments', function (Blueprint $table) {
            $table->id();
            $table->string('brand');
            $table->string('model');
            $table->unsignedSmallInteger('year');
            $table->timestamps();
            $table->unique(['brand', 'model', 'year']);
        });

        Schema::create('catalog_vehicles', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('brand');
            $table->string('model');
            $table->unsignedSmallInteger('year');
            $table->unsignedInteger('price');
            $table->string('tagline');
            $table->string('body_type');
            $table->string('fuel_type');
            $table->string('transmission');
            $table->string('condition');
            $table->unsignedInteger('mileage_km')->default(0);
            $table->unsignedSmallInteger('horsepower');
            $table->unsignedTinyInteger('seats')->default(5);
            $table->json('features');
            $table->string('accent_from');
            $table->string('accent_to');
            $table->boolean('highlighted')->default(false);
            $table->timestamps();
        });

        Schema::create('compatible_parts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('sku')->unique();
            $table->string('name');
            $table->string('category');
            $table->string('brand');
            $table->unsignedInteger('price');
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedSmallInteger('amperage')->nullable();
            $table->unsignedTinyInteger('voltage')->nullable();
            $table->string('bci_group')->nullable();
            $table->string('fuse_type')->nullable();
            $table->string('color')->nullable();
            $table->timestamps();
        });

        Schema::create('marketplace_parts', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('sku')->unique();
            $table->string('name');
            $table->string('category');
            $table->string('brand');
            $table->string('condition');
            $table->unsignedInteger('price');
            $table->unsignedInteger('original_price')->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->decimal('rating', 3, 1)->default(4.5);
            $table->unsignedInteger('reviews')->default(0);
            $table->string('seller')->default('AutoDrive Oficial');
            $table->boolean('free_shipping')->default(true);
            $table->unsignedTinyInteger('warranty_months')->default(12);
            $table->json('compatible_brands');
            $table->unsignedSmallInteger('year_from')->default(2012);
            $table->unsignedSmallInteger('year_to')->default(2024);
            $table->json('specs');
            $table->string('accent_from');
            $table->string('accent_to');
            $table->timestamps();
        });

        Schema::create('inventory_items', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('sku')->unique();
            $table->string('name');
            $table->string('category');
            $table->unsignedInteger('stock')->default(0);
            $table->unsignedInteger('price');
            $table->unsignedInteger('reorder_level')->default(5);
            $table->unsignedInteger('units_sold')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_items');
        Schema::dropIfExists('marketplace_parts');
        Schema::dropIfExists('compatible_parts');
        Schema::dropIfExists('catalog_vehicles');
        Schema::dropIfExists('vehicle_fitments');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};