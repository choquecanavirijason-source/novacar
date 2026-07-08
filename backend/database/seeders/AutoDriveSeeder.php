<?php

namespace Database\Seeders;

use App\Models\CatalogVehicle;
use App\Models\CompatiblePart;
use App\Models\InventoryItem;
use App\Models\MarketplacePart;
use App\Models\User;
use App\Models\VehicleFitment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AutoDriveSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@autodrive.com'],
            ['name' => 'Admin AutoDrive', 'password' => Hash::make('demo'), 'role' => 'admin'],
        );

        $fitments = [
            ['Nissan', 'Versa', 2019], ['Nissan', 'Versa', 2020], ['Nissan', 'Versa', 2021], ['Nissan', 'Versa', 2022],
            ['Nissan', 'Sentra', 2018], ['Nissan', 'Sentra', 2020], ['Nissan', 'Sentra', 2023],
            ['Volkswagen', 'Jetta', 2018], ['Volkswagen', 'Jetta', 2020], ['Volkswagen', 'Jetta', 2022],
            ['Toyota', 'Corolla', 2019], ['Toyota', 'Corolla', 2021], ['Toyota', 'Corolla', 2023],
            ['Chevrolet', 'Aveo', 2017], ['Chevrolet', 'Onix', 2021], ['Chevrolet', 'Onix', 2023],
        ];
        foreach ($fitments as [$brand, $model, $year]) {
            VehicleFitment::updateOrCreate(['brand' => $brand, 'model' => $model, 'year' => $year]);
        }

        $vehicles = [
            ['nissan-versa-2021', 'Nissan', 'Versa Sense', 2021, 289000, 'Sedán eficiente, confiable y con bajo consumo.', 'sedan', 'gasolina', 'automatica', 'seminuevo', 28000, 118, 5, ['Cámara de reversa', 'Apple CarPlay'], '#3d6bff', '#22e0ff', true],
            ['vw-jetta-2022', 'Volkswagen', 'Jetta Trendline', 2022, 410000, 'Premium alemán accesible, motor turbo TSI.', 'sedan', 'gasolina', 'automatica', 'nuevo', 0, 158, 5, ['Turbo TSI', 'Climatronic'], '#5b6cff', '#9b5bff', true],
            ['toyota-corolla-2023', 'Toyota', 'Corolla Hybrid', 2023, 445000, 'Híbrido líder en reventa.', 'sedan', 'hibrido', 'automatica', 'nuevo', 0, 138, 5, ['Toyota Safety Sense'], '#22e0ff', '#2ee6a6', true],
            ['mazda-cx5-2022', 'Mazda', 'CX-5 Grand Touring', 2022, 612000, 'SUV deportiva AWD.', 'suv', 'gasolina', 'automatica', 'seminuevo', 19500, 187, 5, ['AWD i-ACTIV'], '#ff5d73', '#ff9b3d', true],
            ['tesla-model3-2023', 'Tesla', 'Model 3', 2023, 985000, '100% eléctrico con autopilot.', 'sedan', 'electrico', 'automatica', 'nuevo', 0, 283, 5, ['Autopilot'], '#22e0ff', '#5b6cff', true],
        ];
        foreach ($vehicles as $v) {
            CatalogVehicle::updateOrCreate(['id' => $v[0]], [
                'brand' => $v[1], 'model' => $v[2], 'year' => $v[3], 'price' => $v[4], 'tagline' => $v[5],
                'body_type' => $v[6], 'fuel_type' => $v[7], 'transmission' => $v[8], 'condition' => $v[9],
                'mileage_km' => $v[10], 'horsepower' => $v[11], 'seats' => $v[12], 'features' => $v[13],
                'accent_from' => $v[14], 'accent_to' => $v[15], 'highlighted' => $v[16],
            ]);
        }

        $parts = [
            ['b1', 'BAT-35-600', 'Batería LTH Grupo 35', 'battery', 'LTH', 2890, 12, 600, 12, 'Grupo 35', null, null],
            ['b2', 'BAT-42-700', 'Batería Bosch S4 Grupo 42', 'battery', 'Bosch', 3450, 4, 700, 12, 'Grupo 42', null, null],
            ['f1', 'FUS-MINI-10', 'Fusible Mini 10A', 'fuse', 'Littelfuse', 35, 240, 10, null, null, 'Mini', '#e23c3c'],
            ['f2', 'FUS-BLADE-15', 'Fusible Blade 15A', 'fuse', 'Bosch', 28, 180, 15, null, null, 'Blade', '#3c7be2'],
        ];
        foreach ($parts as $p) {
            CompatiblePart::updateOrCreate(['id' => $p[0]], [
                'sku' => $p[1], 'name' => $p[2], 'category' => $p[3], 'brand' => $p[4], 'price' => $p[5],
                'stock' => $p[6], 'amperage' => $p[7], 'voltage' => $p[8], 'bci_group' => $p[9],
                'fuse_type' => $p[10], 'color' => $p[11],
            ]);
        }

        MarketplacePart::updateOrCreate(['id' => 'bat-1'], [
            'sku' => 'BAT-1', 'name' => 'Batería LTH Grupo 35 · 600 CCA', 'category' => 'battery',
            'brand' => 'LTH', 'condition' => 'nuevo', 'price' => 2890, 'stock' => 30, 'rating' => 4.7,
            'reviews' => 156, 'seller' => 'AutoDrive Oficial', 'free_shipping' => true, 'warranty_months' => 12,
            'compatible_brands' => ['Nissan', 'Volkswagen', 'Toyota'], 'year_from' => 2012, 'year_to' => 2024,
            'specs' => [['label' => 'Grupo', 'value' => 'BCI 35']], 'accent_from' => '#3d6bff', 'accent_to' => '#22e0ff',
        ]);
        MarketplacePart::updateOrCreate(['id' => 'tir-1'], [
            'sku' => 'TIR-1', 'name' => 'Llanta 205/55 R16 (juego de 4)', 'category' => 'tires',
            'brand' => 'Michelin', 'condition' => 'nuevo', 'price' => 7600, 'stock' => 24, 'rating' => 4.9,
            'reviews' => 210, 'seller' => 'AutoDrive Oficial', 'free_shipping' => true, 'warranty_months' => 12,
            'compatible_brands' => ['Nissan', 'Toyota', 'Honda'], 'year_from' => 2012, 'year_to' => 2024,
            'specs' => [['label' => 'Medida', 'value' => '205/55 R16']], 'accent_from' => '#22e0ff', 'accent_to' => '#2ee6a6',
        ]);

        $inventory = [
            ['v1', 'VH-VERSA-21', 'Nissan Versa Sense 2021', 'vehicle', 6, 289000, 2, 12],
            ['v2', 'VH-JETTA-22', 'VW Jetta Trendline 2022', 'vehicle', 1, 410000, 2, 8],
            ['b1', 'BAT-35-600', 'Batería LTH Grupo 35', 'battery', 12, 2890, 5, 84],
            ['b2', 'BAT-42-700', 'Batería Bosch S4 Grupo 42', 'battery', 4, 3450, 5, 41],
            ['f1', 'FUS-MINI-10', 'Fusible Mini 10A', 'fuse', 240, 35, 50, 530],
            ['f3', 'FUS-MINI-20', 'Fusible Mini 20A', 'fuse', 3, 32, 50, 120],
        ];
        foreach ($inventory as $i) {
            InventoryItem::updateOrCreate(['id' => $i[0]], [
                'sku' => $i[1], 'name' => $i[2], 'category' => $i[3], 'stock' => $i[4],
                'price' => $i[5], 'reorder_level' => $i[6], 'units_sold' => $i[7],
            ]);
        }
    }
}