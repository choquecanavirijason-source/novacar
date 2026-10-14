<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Banner;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Banner>
 */
class BannerFactory extends Factory
{
    protected $model = Banner::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->randomElement([
                'Autopartes con envío gratis',
                'Autos seminuevos certificados',
                'Hasta 50 % en llantas seleccionadas',
            ]),
            'subtitle' => fake()->sentence(8),
            'image_url' => '/car-azul-hero.png',
            'cta_label' => fake()->randomElement(['Ver autopartes', 'Ver catálogo', 'Aprovechar']),
            'href' => fake()->randomElement(['/autopartes', '/catalogo', '/importaciones']),
            'accent_from' => '#005f8f',
            'accent_to' => '#00aaff',
            'active' => true,
            'sort_order' => 0,
            'created_by' => null,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes): array => ['active' => false]);
    }

    public function atPosition(int $position): static
    {
        return $this->state(fn (array $attributes): array => ['sort_order' => $position]);
    }
}
