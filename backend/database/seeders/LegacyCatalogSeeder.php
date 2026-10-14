<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\CompatiblePart;
use App\Models\InventoryItem;
use App\Models\VehicleFitment;
use Illuminate\Database\Seeder;

/**
 * Datos de las tablas heredadas que siguen sirviendo endpoints vivos:
 * `vehicle_fitments` (buscador por pasos), `compatible_parts` (catálogo técnico
 * de baterías y fusibles) e `inventory_items` (tablero de reposición).
 */
class LegacyCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedFitments();
        $this->seedCompatibleParts();
        $this->seedInventory();
    }

    private function seedFitments(): void
    {
        $fitments = [
            ['Nissan', 'Versa', 2019], ['Nissan', 'Versa', 2020], ['Nissan', 'Versa', 2021],
            ['Nissan', 'Sentra', 2018], ['Nissan', 'Sentra', 2020], ['Nissan', 'Sentra', 2023],
            ['Volkswagen', 'Jetta', 2018], ['Volkswagen', 'Jetta', 2020], ['Volkswagen', 'Jetta', 2022],
            ['Toyota', 'Corolla', 2019], ['Toyota', 'Corolla', 2021], ['Toyota', 'Corolla', 2023],
            ['Chevrolet', 'Aveo', 2017], ['Chevrolet', 'Onix', 2021], ['Chevrolet', 'Onix', 2023],
        ];

        foreach ($fitments as [$brand, $model, $year]) {
            VehicleFitment::query()->firstOrCreate([
                'brand' => $brand,
                'model' => $model,
                'year' => $year,
            ]);
        }
    }

    private function seedCompatibleParts(): void
    {
        $parts = [
            ['b1', 'BAT-35-600', 'Batería LTH Grupo 35', 'battery', 'LTH', 2890, 12, 600, 12, 'Grupo 35', null, null],
            ['b2', 'BAT-42-700', 'Batería Bosch S4 Grupo 42', 'battery', 'Bosch', 3450, 4, 700, 12, 'Grupo 42', null, null],
            ['f1', 'FUS-MINI-10', 'Fusible Mini 10A', 'fuse', 'Littelfuse', 35, 240, 10, null, null, 'Mini', '#e23c3c'],
            ['f2', 'FUS-BLADE-15', 'Fusible Blade 15A', 'fuse', 'Bosch', 28, 180, 15, null, null, 'Blade', '#3c7be2'],
        ];

        foreach ($parts as $part) {
            CompatiblePart::query()->updateOrCreate(['id' => $part[0]], [
                'sku' => $part[1],
                'name' => $part[2],
                'category' => $part[3],
                'brand' => $part[4],
                'price' => $part[5],
                'stock' => $part[6],
                'amperage' => $part[7],
                'voltage' => $part[8],
                'bci_group' => $part[9],
                'fuse_type' => $part[10],
                'color' => $part[11],
            ]);
        }
    }

    private function seedInventory(): void
    {
        $items = [
            ['v1', 'VH-VERSA-21', 'Nissan Versa Sense 2021', 'vehicle', 6, 289000, 2, 12],
            ['v2', 'VH-JETTA-22', 'Volkswagen Jetta Trendline 2022', 'vehicle', 3, 410000, 2, 7],
            ['b1', 'BAT-35-600', 'Batería LTH Grupo 35', 'battery', 12, 2890, 5, 48],
            ['b2', 'BAT-42-700', 'Batería Bosch S4 Grupo 42', 'battery', 4, 3450, 5, 31],
            ['f1', 'FUS-MINI-10', 'Fusible Mini 10A', 'fuse', 240, 35, 50, 320],
            ['f2', 'FUS-BLADE-15', 'Fusible Blade 15A', 'fuse', 180, 28, 50, 210],
        ];

        foreach ($items as $item) {
            InventoryItem::query()->updateOrCreate(['id' => $item[0]], [
                'sku' => $item[1],
                'name' => $item[2],
                'category' => $item[3],
                'stock' => $item[4],
                'price' => $item[5],
                'reorder_level' => $item[6],
                'units_sold' => $item[7],
            ]);
        }
    }
}
