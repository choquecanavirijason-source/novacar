<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Alinea `marketplace_parts` con MarketplacePartDTO: el descuento dejó de
 * viajar como `original_price` y pasó a `discount_percent`; se agregan
 * `reorder_level` (umbral de stock bajo del panel) e `image_url`.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marketplace_parts', function (Blueprint $table): void {
            $table->unsignedTinyInteger('discount_percent')->default(0);
            $table->unsignedInteger('reorder_level')->default(5);
            $table->longText('image_url')->nullable();
            $table->softDeletes();
        });

        $this->backfillDiscountPercent();

        Schema::table('marketplace_parts', function (Blueprint $table): void {
            $table->dropColumn('original_price');
        });

        Schema::table('marketplace_parts', function (Blueprint $table): void {
            $table->index('category', 'marketplace_parts_category_index');
            $table->index('brand', 'marketplace_parts_brand_index');
            $table->index('condition', 'marketplace_parts_condition_index');
            $table->index('price', 'marketplace_parts_price_index');
            $table->index(['stock', 'reorder_level'], 'marketplace_parts_stock_reorder_index');
            $table->index(['year_from', 'year_to'], 'marketplace_parts_year_range_index');
        });
    }

    public function down(): void
    {
        Schema::table('marketplace_parts', function (Blueprint $table): void {
            $table->dropIndex('marketplace_parts_category_index');
            $table->dropIndex('marketplace_parts_brand_index');
            $table->dropIndex('marketplace_parts_condition_index');
            $table->dropIndex('marketplace_parts_price_index');
            $table->dropIndex('marketplace_parts_stock_reorder_index');
            $table->dropIndex('marketplace_parts_year_range_index');
        });

        Schema::table('marketplace_parts', function (Blueprint $table): void {
            $table->unsignedInteger('original_price')->nullable();
        });

        Schema::table('marketplace_parts', function (Blueprint $table): void {
            $table->dropSoftDeletes();
            $table->dropColumn(['discount_percent', 'reorder_level', 'image_url']);
        });
    }

    /**
     * Conserva el descuento implícito de las filas ya existentes antes de
     * borrar la columna vieja: descuento = 1 - (precio / precio original).
     */
    private function backfillDiscountPercent(): void
    {
        $rows = DB::table('marketplace_parts')
            ->whereNotNull('original_price')
            ->where('original_price', '>', 0)
            ->get(['id', 'price', 'original_price']);

        foreach ($rows as $row) {
            $percent = (int) round((1 - ($row->price / $row->original_price)) * 100);

            DB::table('marketplace_parts')
                ->where('id', $row->id)
                ->update(['discount_percent' => max(0, min(90, $percent))]);
        }
    }
};
