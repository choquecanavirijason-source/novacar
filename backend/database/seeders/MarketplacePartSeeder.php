<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\PartCategory;
use App\Enums\PartCondition;
use App\Models\MarketplacePart;
use Illuminate\Database\Seeder;

/**
 * Siembra el catálogo de autopartes con los mismos identificadores que el mock
 * del frontend, cubriendo las 12 categorías del marketplace.
 */
class MarketplacePartSeeder extends Seeder
{
    private const ALL_BRANDS = ['Nissan', 'Volkswagen', 'Toyota', 'Mazda', 'Honda', 'Chevrolet', 'Ford', 'Hyundai', 'Kia'];

    public function run(): void
    {
        foreach ($this->parts() as $part) {
            MarketplacePart::query()->updateOrCreate(['id' => $part['id']], $part);
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function parts(): array
    {
        return [
            $this->part('eng-1', 'Motor 1.6L 16v reconstruido', PartCategory::Engine, 'Nissan', 38_500, [
                'condition' => PartCondition::Reconstruido,
                'discount_percent' => 14, 'stock' => 3, 'rating' => 4.7, 'reviews' => 28, 'warranty_months' => 6,
                'compatible_brands' => ['Nissan'],
                'specs' => [
                    ['label' => 'Cilindrada', 'value' => '1.6L'],
                    ['label' => 'Válvulas', 'value' => '16v'],
                ],
            ]),
            $this->part('eng-2', 'Motor 2.0 TSI turbo seminuevo', PartCategory::Engine, 'Volkswagen', 64_900, [
                'condition' => PartCondition::Usado,
                'stock' => 1, 'rating' => 4.4, 'reviews' => 12, 'free_shipping' => false, 'warranty_months' => 3,
                'compatible_brands' => ['Volkswagen'],
                'specs' => [['label' => 'Inducción', 'value' => 'Turbo TSI']],
            ]),
            $this->part('tir-1', 'Llanta 205/55 R16 (juego de 4)', PartCategory::Tires, 'Michelin', 7_600, [
                'stock' => 24, 'rating' => 4.9, 'reviews' => 210,
                'compatible_brands' => self::ALL_BRANDS,
                'specs' => [['label' => 'Medida', 'value' => '205/55 R16'], ['label' => 'Piezas', 'value' => '4']],
            ]),
            $this->part('tir-2', 'Llanta 195/65 R15 (juego de 4)', PartCategory::Tires, 'Goodyear', 6_200, [
                'discount_percent' => 11, 'stock' => 16, 'rating' => 4.6, 'reviews' => 98,
                'compatible_brands' => self::ALL_BRANDS,
                'specs' => [['label' => 'Medida', 'value' => '195/65 R15']],
            ]),
            $this->part('sea-1', 'Asiento delantero de piel', PartCategory::Seats, 'OEM', 4_300, [
                'condition' => PartCondition::Usado,
                'stock' => 5, 'rating' => 4.2, 'reviews' => 17, 'free_shipping' => false, 'warranty_months' => 0,
                'specs' => [['label' => 'Material', 'value' => 'Piel']],
            ]),
            $this->part('sea-2', 'Par de asientos deportivos', PartCategory::Seats, 'Recaro', 18_900, [
                'stock' => 2, 'rating' => 4.8, 'reviews' => 34,
                'specs' => [['label' => 'Tipo', 'value' => 'Deportivo'], ['label' => 'Piezas', 'value' => '2']],
            ]),
            $this->part('bat-1', 'Batería LTH Grupo 35 · 600 CCA', PartCategory::Battery, 'LTH', 2_890, [
                'stock' => 30, 'rating' => 4.7, 'reviews' => 156,
                'specs' => [
                    ['label' => 'Grupo', 'value' => 'BCI 35'],
                    ['label' => 'CCA', 'value' => '600 A'],
                    ['label' => 'Voltaje', 'value' => '12 V'],
                ],
            ]),
            $this->part('bat-2', 'Batería Bosch S4 Grupo 42 · 700 CCA', PartCategory::Battery, 'Bosch', 3_450, [
                'stock' => 14, 'rating' => 4.8, 'reviews' => 89,
                'specs' => [['label' => 'Grupo', 'value' => 'BCI 42'], ['label' => 'CCA', 'value' => '700 A']],
            ]),
            $this->part('fus-1', 'Kit de fusibles Mini (surtido 120 pzs)', PartCategory::Fuse, 'Littelfuse', 320, [
                'stock' => 200, 'rating' => 4.9, 'reviews' => 320,
                'compatible_brands' => self::ALL_BRANDS,
                'specs' => [['label' => 'Tipo', 'value' => 'Mini'], ['label' => 'Piezas', 'value' => '120']],
            ]),
            $this->part('fus-2', 'Fusibles Blade surtido (80 pzs)', PartCategory::Fuse, 'Bosch', 240, [
                'stock' => 150, 'rating' => 4.7, 'reviews' => 142,
                'compatible_brands' => self::ALL_BRANDS,
                'specs' => [['label' => 'Tipo', 'value' => 'Blade']],
            ]),
            $this->part('brk-1', 'Balatas cerámicas delanteras', PartCategory::Brakes, 'Brembo', 1_290, [
                'stock' => 40, 'rating' => 4.8, 'reviews' => 76,
                'specs' => [['label' => 'Tipo', 'value' => 'Cerámica'], ['label' => 'Posición', 'value' => 'Delantero']],
            ]),
            $this->part('brk-2', 'Discos de freno ventilados (par)', PartCategory::Brakes, 'ATE', 2_150, [
                'discount_percent' => 17, 'stock' => 18, 'rating' => 4.6, 'reviews' => 51,
                'specs' => [['label' => 'Tipo', 'value' => 'Ventilado']],
            ]),
            $this->part('sus-1', 'Amortiguadores delanteros (par)', PartCategory::Suspension, 'Monroe', 3_380, [
                'stock' => 12, 'rating' => 4.5, 'reviews' => 44,
                'specs' => [['label' => 'Posición', 'value' => 'Delantero']],
            ]),
            $this->part('sus-2', 'Kit de horquillas y rótulas', PartCategory::Suspension, 'Moog', 2_480, [
                'condition' => PartCondition::Reconstruido,
                'stock' => 6, 'rating' => 4.3, 'reviews' => 22, 'warranty_months' => 6,
                'specs' => [['label' => 'Incluye', 'value' => 'Horquillas + rótulas']],
            ]),
            $this->part('oil-1', 'Aceite sintético 5W-30 (4L)', PartCategory::Oil, 'Mobil 1', 690, [
                'stock' => 120, 'rating' => 4.9, 'reviews' => 410, 'warranty_months' => 0,
                'compatible_brands' => self::ALL_BRANDS,
                'specs' => [['label' => 'Viscosidad', 'value' => '5W-30'], ['label' => 'Volumen', 'value' => '4 L']],
            ]),
            $this->part('oil-2', 'Aceite semisintético 10W-40 (5L)', PartCategory::Oil, 'Castrol', 540, [
                'stock' => 90, 'rating' => 4.6, 'reviews' => 188, 'warranty_months' => 0,
                'compatible_brands' => self::ALL_BRANDS,
                'specs' => [['label' => 'Viscosidad', 'value' => '10W-40']],
            ]),
            $this->part('lig-1', 'Faro delantero LED (lado izq.)', PartCategory::Lights, 'Philips', 2_890, [
                'stock' => 9, 'rating' => 4.5, 'reviews' => 37,
                'specs' => [['label' => 'Tecnología', 'value' => 'LED'], ['label' => 'Lado', 'value' => 'Izquierdo']],
            ]),
            $this->part('lig-2', 'Kit de halógenos H4 (par)', PartCategory::Lights, 'Osram', 380, [
                'stock' => 60, 'rating' => 4.4, 'reviews' => 64, 'free_shipping' => false,
                'compatible_brands' => self::ALL_BRANDS,
                'specs' => [['label' => 'Base', 'value' => 'H4']],
            ]),
            $this->part('fil-1', 'Filtro de aire de alto flujo', PartCategory::Filters, 'K&N', 760, [
                'stock' => 48, 'rating' => 4.7, 'reviews' => 120,
                'specs' => [['label' => 'Tipo', 'value' => 'Aire'], ['label' => 'Reutilizable', 'value' => 'Sí']],
            ]),
            $this->part('fil-2', 'Kit filtros aceite + cabina', PartCategory::Filters, 'Mann', 410, [
                'stock' => 70, 'rating' => 4.6, 'reviews' => 88,
                'specs' => [['label' => 'Incluye', 'value' => 'Aceite + cabina']],
            ]),
            $this->part('bod-1', 'Cofre/capó de lámina', PartCategory::Body, 'OEM', 5_200, [
                'condition' => PartCondition::Usado,
                'stock' => 3, 'rating' => 4.1, 'reviews' => 9, 'free_shipping' => false, 'warranty_months' => 0,
                'specs' => [['label' => 'Material', 'value' => 'Lámina']],
            ]),
            $this->part('bod-2', 'Espejo lateral eléctrico (der.)', PartCategory::Body, 'OEM', 1_480, [
                'stock' => 11, 'rating' => 4.5, 'reviews' => 26,
                'specs' => [['label' => 'Lado', 'value' => 'Derecho']],
            ]),
            $this->part('aud-1', 'Estéreo Android 9" CarPlay', PartCategory::Audio, 'Pioneer', 4_200, [
                'discount_percent' => 18, 'stock' => 15, 'rating' => 4.8, 'reviews' => 175,
                'compatible_brands' => self::ALL_BRANDS,
                'specs' => [['label' => 'Pantalla', 'value' => '9"'], ['label' => 'Sistema', 'value' => 'Android + CarPlay']],
            ]),
            $this->part('aud-2', 'Bocinas 6.5" 2 vías (par)', PartCategory::Audio, 'JBL', 1_290, [
                'stock' => 33, 'rating' => 4.6, 'reviews' => 142,
                'compatible_brands' => self::ALL_BRANDS,
                'specs' => [['label' => 'Tamaño', 'value' => '6.5"'], ['label' => 'Vías', 'value' => '2']],
            ]),
        ];
    }

    /**
     * Base común de una autoparte; `$overrides` solo declara lo que difiere.
     *
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function part(
        string $id,
        string $name,
        PartCategory $category,
        string $brand,
        int $price,
        array $overrides = [],
    ): array {
        return [
            'id' => $id,
            'sku' => strtoupper($id),
            'name' => $name,
            'category' => $category,
            'brand' => $brand,
            'condition' => PartCondition::Nuevo,
            'price' => $price,
            'discount_percent' => 0,
            'stock' => 8,
            'reorder_level' => 5,
            'image_url' => null,
            'rating' => 4.5,
            'reviews' => 40,
            'seller' => 'NOVACAR Oficial',
            'free_shipping' => true,
            'warranty_months' => 12,
            'compatible_brands' => array_slice(self::ALL_BRANDS, 0, 4),
            'year_from' => 2012,
            'year_to' => 2024,
            'specs' => [],
            'accent_from' => '#005f8f',
            'accent_to' => '#00aaff',
            ...$overrides,
        ];
    }
}
