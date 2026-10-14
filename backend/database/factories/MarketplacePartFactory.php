<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\PartCategory;
use App\Enums\PartCondition;
use App\Models\MarketplacePart;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<MarketplacePart>
 */
class MarketplacePartFactory extends Factory
{
    protected $model = MarketplacePart::class;

    private const BRANDS = ['Bosch', 'LTH', 'Michelin', 'Brembo', 'Monroe', 'K&N', 'JBL', 'Philips', 'OEM'];

    private const COMPATIBLE = ['Nissan', 'Volkswagen', 'Toyota', 'Mazda', 'Honda', 'Chevrolet', 'Ford'];

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $category = fake()->randomElement(PartCategory::cases());
        $name = $category->label().' '.fake()->word();
        $stock = fake()->numberBetween(0, 120);

        return [
            'id' => Str::slug("{$category->value} {$name}").'-'.Str::lower(Str::random(4)),
            'sku' => $category->skuPrefix().'-'.fake()->unique()->numberBetween(1000, 9999),
            'name' => Str::title($name),
            'category' => $category,
            'brand' => fake()->randomElement(self::BRANDS),
            'condition' => PartCondition::Nuevo,

            'price' => fake()->numberBetween(240, 64_900),
            'discount_percent' => 0,
            'stock' => $stock,
            'reorder_level' => 5,

            'image_url' => null,
            'rating' => fake()->randomFloat(1, 3.8, 5.0),
            'reviews' => fake()->numberBetween(0, 420),
            'seller' => 'NOVACAR Oficial',

            'free_shipping' => fake()->boolean(70),
            'warranty_months' => 12,

            'compatible_brands' => fake()->randomElements(self::COMPATIBLE, fake()->numberBetween(1, 5)),
            'year_from' => 2012,
            'year_to' => (int) date('Y'),

            'specs' => [
                ['label' => 'Marca', 'value' => fake()->randomElement(self::BRANDS)],
            ],
            'accent_from' => '#005f8f',
            'accent_to' => '#00aaff',
        ];
    }

    /** Fuerza la categoría (útil para sembrar el marketplace por secciones). */
    public function ofCategory(PartCategory $category): static
    {
        return $this->state(fn (array $attributes): array => [
            'category' => $category,
            'sku' => $category->skuPrefix().'-'.fake()->unique()->numberBetween(1000, 9999),
        ]);
    }

    /** En o por debajo del umbral: dispara la alerta del panel. */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes): array => [
            'stock' => fake()->numberBetween(0, 3),
            'reorder_level' => 5,
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes): array => ['stock' => 0]);
    }

    public function discounted(int $percent = 15): static
    {
        return $this->state(fn (array $attributes): array => [
            'discount_percent' => max(0, min(90, $percent)),
        ]);
    }

    /**
     * Pieza universal: sin marcas declaradas, compatible con cualquier vehículo.
     */
    public function universal(): static
    {
        return $this->state(fn (array $attributes): array => ['compatible_brands' => []]);
    }

    /** Usada o reconstruida: garantía acotada por la condición. */
    public function secondHand(PartCondition $condition = PartCondition::Usado): static
    {
        return $this->state(fn (array $attributes): array => [
            'condition' => $condition,
            'warranty_months' => $condition->maxWarrantyMonths(),
        ]);
    }
}
