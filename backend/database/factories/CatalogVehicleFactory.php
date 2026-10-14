<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\BodyType;
use App\Enums\DamageSeverity;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\VehicleCondition;
use App\Models\CatalogVehicle;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<CatalogVehicle>
 */
class CatalogVehicleFactory extends Factory
{
    protected $model = CatalogVehicle::class;

    /** Marcas y modelos plausibles para que los datos de prueba no sean ruido. */
    private const CATALOG = [
        'Nissan' => ['Versa Sense', 'Sentra Advance', 'March Active'],
        'Volkswagen' => ['Jetta Trendline', 'Virtus Highline', 'T-Cross'],
        'Toyota' => ['Corolla Hybrid', 'Yaris Core', 'Hilux SR'],
        'Mazda' => ['CX-5 Grand Touring', 'Mazda 3 i Grand', 'CX-30'],
        'BMW' => ['E46 M3', 'Serie 3 320i', 'X1 sDrive'],
        'Tesla' => ['Model 3', 'Model Y'],
    ];

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brand = fake()->randomElement(array_keys(self::CATALOG));
        $model = fake()->randomElement(self::CATALOG[$brand]);
        $year = fake()->numberBetween(2015, (int) date('Y'));
        $condition = fake()->randomElement(VehicleCondition::cases());

        return [
            'id' => Str::slug("{$brand} {$model} {$year}").'-'.Str::lower(Str::random(4)),
            'brand' => $brand,
            'model' => $model,
            'year' => $year,
            'price' => fake()->numberBetween(180, 990) * 1000,
            'tagline' => fake()->sentence(8),

            'body_type' => fake()->randomElement(BodyType::cases()),
            'fuel_type' => fake()->randomElement(FuelType::cases()),
            'transmission' => fake()->randomElement(TransmissionType::cases()),
            'condition' => $condition,

            'mileage_km' => $condition === VehicleCondition::Nuevo ? 0 : fake()->numberBetween(5_000, 90_000),
            'horsepower' => fake()->numberBetween(48, 340),
            'seats' => fake()->randomElement([2, 4, 5, 7]),
            'features' => fake()->randomElements(
                ['Cámara de reversa', 'Apple CarPlay', 'Bluetooth', 'Aire acondicionado',
                    'Control de crucero', 'Sensores de estacionamiento', 'Techo solar'],
                fake()->numberBetween(2, 5),
            ),

            'image_url' => null,
            'accent_from' => '#005f8f',
            'accent_to' => '#00aaff',
            'highlighted' => false,

            'color' => fake()->randomElement(['Blanco', 'Negro Carbón', 'Gris Platino', 'Azul Metálico', 'Rojo']),
            'doors' => fake()->randomElement([2, 4, 5]),
            'cylinders' => fake()->randomElement([3, 4, 6]),
            'displacement' => fake()->randomElement(['1.4L', '1.6L', '1.8L', '2.0L', '3.2L']),
            'drive_type' => fake()->randomElement(['FRONT WHEEL DRIVE', 'REAR WHEEL DRIVE', 'ALL WHEEL DRIVE']),

            'title_code' => 'FL - Certificate Of Title',
            'sale_date' => fake()->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d'),
            'sale_time' => fake()->randomElement(['9:00 AM GMT-4', '10:00 AM GMT-4', '2:00 PM GMT-4']),
            'sale_location' => fake()->randomElement(['Miami, FL', 'Cochabamba, BO', 'Santa Cruz, BO']),
            'has_keys' => true,
            'run_and_drive' => true,

            'damage_type' => 'Sin daños reportados',
            'damage_severity' => DamageSeverity::None,
            'damage_description' => null,
            'notes' => null,
            'highlights' => ['Run and Drive'],
        ];
    }

    /** Aparece en la franja de destacados del home. */
    public function highlighted(): static
    {
        return $this->state(fn (array $attributes): array => ['highlighted' => true]);
    }

    /** Unidad 0 km: sin kilometraje y sin daños. */
    public function brandNew(): static
    {
        return $this->state(fn (array $attributes): array => [
            'condition' => VehicleCondition::Nuevo,
            'mileage_km' => 0,
            'damage_severity' => DamageSeverity::None,
            'damage_type' => 'Sin daños reportados',
            'highlights' => ['0 Kilómetros', 'Garantía de fábrica'],
        ]);
    }

    /** Eléctrico puro: sin cilindros y con transmisión automática. */
    public function electric(): static
    {
        return $this->state(fn (array $attributes): array => [
            'fuel_type' => FuelType::Electrico,
            'transmission' => TransmissionType::Automatica,
            'cylinders' => 0,
            'displacement' => 'Motor eléctrico',
        ]);
    }

    /** Motocicleta: sin puertas y con dos plazas. */
    public function motorcycle(): static
    {
        return $this->state(fn (array $attributes): array => [
            'body_type' => BodyType::Motocicleta,
            'doors' => 0,
            'seats' => 2,
            'drive_type' => 'CHAIN DRIVE',
        ]);
    }

    /** Unidad con daños declarados, para probar la ficha de estado físico. */
    public function damaged(DamageSeverity $severity = DamageSeverity::Minor): static
    {
        return $this->state(fn (array $attributes): array => [
            'condition' => VehicleCondition::Seminuevo,
            'damage_severity' => $severity,
            'damage_type' => 'Abolladuras/arañazos menores',
            'damage_description' => 'Detalles de pintura acordes al año y uso del vehículo.',
        ]);
    }
}
