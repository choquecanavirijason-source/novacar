<?php

declare(strict_types=1);

namespace App\Services;

use App\DataTransferObjects\RegisterUserData;
use App\Exceptions\DuplicateResourceException;
use App\Exceptions\InvalidCredentialsException;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\NewAccessToken;

/**
 * Autenticación por tokens personales de Sanctum.
 *
 * El frontend guarda el token en localStorage y lo manda como Bearer, así que
 * la sesión no depende de cookies ni de CSRF.
 */
final class AuthService
{
    /**
     * Registra una cuenta nueva. El rol viene del DTO (por defecto `customer`),
     * nunca del payload HTTP.
     *
     * @return array{user: User, token: string}
     *
     * @throws DuplicateResourceException
     */
    public function register(RegisterUserData $data, string $deviceName = 'novacar-web'): array
    {
        if (User::query()->where('email', $data->email)->exists()) {
            throw DuplicateResourceException::email($data->email);
        }

        $user = DB::transaction(static fn (): User => User::query()->create([
            'name' => $data->name,
            'email' => $data->email,
            // El cast `hashed` del modelo se encarga del hashing.
            'password' => $data->password,
            'phone' => $data->phone,
            'role' => $data->role,
        ]));

        return [
            'user' => $user,
            'token' => $this->issueToken($user, $deviceName)->plainTextToken,
        ];
    }

    /**
     * Valida credenciales y emite un token nuevo.
     *
     * @return array{user: User, token: string}
     *
     * @throws InvalidCredentialsException
     */
    public function login(string $email, string $password, string $deviceName = 'novacar-web'): array
    {
        $user = User::query()->where('email', mb_strtolower(trim($email)))->first();

        if ($user === null) {
            // Se paga el mismo coste de hashing aunque el correo no exista, para
            // que el tiempo de respuesta no revele qué cuentas están registradas.
            Hash::make($password);

            throw new InvalidCredentialsException;
        }

        if (! Hash::check($password, $user->password)) {
            throw new InvalidCredentialsException;
        }

        $user->forceFill(['last_login_at' => now()])->save();

        return [
            'user' => $user,
            'token' => $this->issueToken($user, $deviceName)->plainTextToken,
        ];
    }

    /**
     * Cierra la sesión actual revocando únicamente el token en uso, para no
     * echar al usuario de sus otros dispositivos.
     */
    public function logout(User $user): void
    {
        $token = $user->currentAccessToken();

        if ($token !== null && method_exists($token, 'delete')) {
            $token->delete();
        }
    }

    /** Revoca todas las sesiones de la cuenta (cambio de contraseña, robo de token). */
    public function logoutEverywhere(User $user): void
    {
        $user->tokens()->delete();
    }

    private function issueToken(User $user, string $deviceName): NewAccessToken
    {
        // Habilidades acotadas por rol: un cliente jamás obtiene permisos de panel.
        $abilities = $user->isStaff() ? ['staff'] : ['customer'];

        return $user->createToken($deviceName, $abilities);
    }
}
