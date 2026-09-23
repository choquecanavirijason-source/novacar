<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marketplace_parts', function (Blueprint $table) {
            $table->unsignedTinyInteger('discount_percent')->default(0)->after('price');
            $table->unsignedInteger('reorder_level')->default(5)->after('stock');
            $table->text('image_url')->nullable()->after('reorder_level');
            $table->dropColumn('original_price');
        });
    }

    public function down(): void
    {
        Schema::table('marketplace_parts', function (Blueprint $table) {
            $table->unsignedInteger('original_price')->nullable();
            $table->dropColumn(['discount_percent', 'reorder_level', 'image_url']);
        });
    }
};
