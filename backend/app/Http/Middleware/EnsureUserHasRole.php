<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\UserRole;
use App\Models\User;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Restringe una ruta a roles concretos: `->middleware('role:admin')`.
 *
 * Complementa a `staff` cuando una operación debe quedar reservada (por
 * ejemplo, permitir que solo un administrador borre registros).
 */
final class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user instanceof User) {
            return response()->json([
                'message' => 'Necesitas iniciar sesión.',
                'error_code' => 'unauthenticated',
            ], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $allowed = array_filter(array_map(UserRole::tryFrom(...), $roles));

        if (! in_array($user->role, $allowed, true)) {
            return response()->json([
                'message' => 'Tu rol no permite realizar esta acción.',
                'error_code' => 'insufficient_role',
                'context' => ['required_roles' => $roles],
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
