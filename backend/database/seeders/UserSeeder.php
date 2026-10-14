<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Cuentas de arranque. Las credenciales replican las del mock del frontend para
 * que la demo funcione igual con la API encendida.
 *
 * IMPORTANTE: estas contraseñas son de desarrollo. En producción hay que
 * rotarlas (o sembrar solo el administrador con una clave del entorno).
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            ['Admin NOVACAR', 'admin@novacar.com', UserRole::Admin, 'demo'],
            ['Operador NOVACAR', 'operador@novacar.com', UserRole::Operator, 'demo'],
            ['Cliente Demo', 'cliente@novacar.com', UserRole::Customer, 'demo'],
        ];

        foreach ($accounts as [$name, $email, $role, $password]) {
            User::query()->updateOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'role' => $role,
                    'password' => Hash::make($password),
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}
