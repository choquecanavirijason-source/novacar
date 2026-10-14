<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    /** Hash reutilizado entre instancias: bcrypt es caro y los tests crean muchos. */
    protected static ?string $password = null;

    /**
     * Por defecto se crea un cliente del sitio público, no personal del panel.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'phone' => fake()->numerify('+591 7#######'),
            'role' => UserRole::Customer,
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes): array => ['email_verified_at' => null]);
    }

    /** Acceso total al panel. */
    public function admin(): static
    {
        return $this->state(fn (array $attributes): array => ['role' => UserRole::Admin]);
    }

    /** Acceso al panel sin privilegios de configuración. */
    public function operator(): static
    {
        return $this->state(fn (array $attributes): array => ['role' => UserRole::Operator]);
    }

    /** Cliente del sitio público: sin acceso al panel. */
    public function customer(): static
    {
        return $this->state(fn (array $attributes): array => ['role' => UserRole::Customer]);
    }

    /** Contraseña conocida para pruebas manuales o demos. */
    public function withPassword(string $password): static
    {
        return $this->state(fn (array $attributes): array => ['password' => Hash::make($password)]);
    }
}
