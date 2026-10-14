<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\QuoteSource;
use App\Enums\QuoteStatus;
use App\Models\QuoteRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<QuoteRequest>
 */
class QuoteRequestFactory extends Factory
{
    protected $model = QuoteRequest::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'source' => QuoteSource::Inquiry,
            'customer_email' => fake()->unique()->safeEmail(),
            'subject' => fake()->sentence(4),
            'details' => fake()->paragraph(),
            'amount' => null,
            'status' => QuoteStatus::New,
            'vehicle_id' => null,
            'part_id' => null,
            'handled_by' => null,
            'handled_at' => null,
            'created_at' => fake()->dateTimeBetween('-20 days', 'now'),
        ];
    }

    /** Cotización de importación: siempre lleva monto estimado. */
    public function import(): static
    {
        return $this->state(fn (array $attributes): array => [
            'source' => QuoteSource::Import,
            'subject' => fake()->randomElement(['Toyota Corolla 2020', 'Nissan Versa 2021', 'BMW Serie 3 2019']),
            'details' => 'Base: $185,000 · Impuestos: $29,600 · Flete: $25,000 · Total: $239,600',
            'amount' => fake()->numberBetween(120_000, 900_000),
        ]);
    }

    public function testDrive(): static
    {
        return $this->state(fn (array $attributes): array => [
            'source' => QuoteSource::TestDrive,
            'subject' => 'Prueba de manejo solicitada',
            'details' => 'El cliente propone visitar la sucursal el próximo fin de semana.',
            'amount' => null,
        ]);
    }

    public function contacted(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => QuoteStatus::Contacted,
            'handled_at' => now(),
        ]);
    }

    public function closed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => QuoteStatus::Closed,
            'handled_at' => now(),
        ]);
    }
}
