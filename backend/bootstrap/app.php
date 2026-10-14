<?php

declare(strict_types=1);

use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\EnsureUserIsStaff;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();

        $middleware->alias([
            'staff' => EnsureUserIsStaff::class,
            'role' => EnsureUserHasRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Toda la API responde JSON, nunca la página de error HTML.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        // Contrato de error homogéneo: `message` + `error_code`. Las excepciones
        // de dominio ya lo producen ellas mismas (DomainException::render);
        // aquí se normalizan las del framework para que el cliente no tenga que
        // distinguir entre unas y otras.
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return $request->is('api/*')
                ? response()->json(['message' => 'Necesitas iniciar sesión.', 'error_code' => 'unauthenticated'], 401)
                : null;
        });

        $exceptions->render(function (AuthorizationException $e, Request $request) {
            return $request->is('api/*')
                ? response()->json([
                    'message' => $e->getMessage() !== '' ? $e->getMessage() : 'No tienes permiso para esta acción.',
                    'error_code' => 'forbidden',
                ], 403)
                : null;
        });

        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            return $request->is('api/*')
                ? response()->json(['message' => 'El recurso solicitado no existe.', 'error_code' => 'not_found'], 404)
                : null;
        });

        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            return $request->is('api/*')
                ? response()->json(['message' => 'La ruta solicitada no existe.', 'error_code' => 'route_not_found'], 404)
                : null;
        });
    })->create();
