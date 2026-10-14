<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\BusinessRuleViolationException;
use App\Exceptions\ResourceNotFoundException;
use App\Models\InventoryItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Inventario operativo legado (`/admin/inventory`).
 *
 * Se mantiene separado de MarketplacePartService porque responde a otra
 * pregunta: aquel administra la ficha comercial, este el conteo físico por SKU.
 */
final class InventoryService
{
    /** Prefijos de SKU por categoría del inventario legado. */
    private const SKU_PREFIXES = [
        'vehicle' => 'VH',
        'battery' => 'BAT',
        'fuse' => 'FUS',
    ];

    /**
     * @return Collection<int, InventoryItem>
     */
    public function list(?string $category = null): Collection
    {
        return InventoryItem::query()->ofCategory($category)->catalogOrder()->get();
    }

    /**
     * @throws ResourceNotFoundException
     */
    public function findOrFail(string $id): InventoryItem
    {
        $item = InventoryItem::query()->find($id);

        if ($item === null) {
            throw ResourceNotFoundException::inventoryItem($id);
        }

        return $item;
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): InventoryItem
    {
        return DB::transaction(function () use ($attributes): InventoryItem {
            $category = (string) $attributes['category'];

            return InventoryItem::query()->create([
                'id' => (string) Str::uuid(),
                'sku' => $attributes['sku'] ?? $this->generateSku($category),
                'name' => $attributes['name'],
                'category' => $category,
                'price' => (int) $attributes['price'],
                'stock' => (int) $attributes['stock'],
                'reorder_level' => (int) $attributes['reorder_level'],
            ]);
        });
    }

    /**
     * @throws ResourceNotFoundException|BusinessRuleViolationException
     */
    public function updateStock(string $id, int $stock): InventoryItem
    {
        if ($stock < 0) {
            throw new BusinessRuleViolationException(
                'El stock no puede quedar en negativo.',
                'negative_stock',
                ['stock' => $stock],
            );
        }

        return DB::transaction(function () use ($id, $stock): InventoryItem {
            $item = InventoryItem::query()->lockForUpdate()->find($id);

            if ($item === null) {
                throw ResourceNotFoundException::inventoryItem($id);
            }

            $item->stock = $stock;
            $item->save();

            return $item;
        });
    }

    /**
     * Top de más vendidos del tablero legado.
     *
     * @return list<array{name: string, units: int}>
     */
    public function topSelling(int $limit = 3): array
    {
        return InventoryItem::query()
            ->orderByDesc('units_sold')
            ->limit($limit)
            ->get()
            ->map(static fn (InventoryItem $item): array => [
                'name' => $item->name,
                'units' => $item->units_sold,
            ])
            ->all();
    }

    private function generateSku(string $category): string
    {
        $prefix = self::SKU_PREFIXES[$category] ?? 'ITM';

        return sprintf('%s-%04d', $prefix, random_int(1000, 9999));
    }
}
