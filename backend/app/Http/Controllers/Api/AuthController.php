<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\DataTransferObjects\RegisterUserData;
use App\Exceptions\InvalidCredentialsException;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * Sesión por tokens de Sanctum.
 */
final class AuthController extends Controller
{
    public function __construct(private readonly AuthService $auth) {}

    /**
     * POST /api/auth/login
     *
     * Se captura la excepción de negocio a propósito: el formulario del sitio
     * espera un 422 con la forma de un error de validación (campo `email`),
     * no el 401 genérico que produciría el manejador central.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $session = $this->auth->login(
                (string) $request->validated('email'),
                (string) $request->validated('password'),
                $request->deviceName(),
            );
        } catch (InvalidCredentialsException $exception) {
            throw ValidationException::withMessages([
                'email' => [$exception->getMessage()],
            ]);
        }

        return response()->json([
            'user' => new UserResource($session['user']),
            'token' => $session['token'],
        ]);
    }

    /** POST /api/auth/register */
    public function register(RegisterRequest $request): JsonResponse
    {
        $session = $this->auth->register(
            RegisterUserData::fromRequest($request),
            $request->string('device_name')->toString() ?: 'novacar-web',
        );

        return response()->json([
            'user' => new UserResource($session['user']),
            'token' => $session['token'],
        ], JsonResponse::HTTP_CREATED);
    }

    /** GET /api/auth/me */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    /** POST /api/auth/logout */
    public function logout(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->auth->logout($user);

        return response()->json(['message' => 'Sesión cerrada.']);
    }
}
