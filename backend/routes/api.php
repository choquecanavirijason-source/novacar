<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Api\Admin\InventoryController;
use App\Http\Controllers\Api\Admin\PartController;
use App\Http\Controllers\Api\Admin\QuoteRequestController as AdminQuoteRequestController;
use App\Http\Controllers\Api\Admin\VehicleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CatalogVehicleController;
use App\Http\Controllers\Api\MarketplacePartController;
use App\Http\Controllers\Api\QuoteRequestController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API de NOVACAR
|--------------------------------------------------------------------------
|
| Tres bloques bien separados:
|   1. Público sin sesión (catálogo, marketplace, banners, buscador).
|   2. Público con throttle estricto (login, registro, cotizaciones).
|   3. Panel: `auth:sanctum` + middleware `staff`.
|
| Los identificadores de vehículos y autopartes son slugs (`nissan-versa-2021`),
| por eso las rutas reciben strings y la resolución vive en los servicios: así
| el "no encontrado" produce siempre el mismo JSON de error.
|
*/

/* ---------------------------------------------------------------- Sesión -- */

Route::prefix('auth')->group(function (): void {
    // Throttle agresivo: son los dos endpoints atacables por fuerza bruta.
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

/* --------------------------------------------------------------- Público -- */

Route::get('/catalog/vehicles', [CatalogVehicleController::class, 'index']);
Route::get('/catalog/vehicles/featured', [CatalogVehicleController::class, 'featured']);
Route::get('/catalog/filters', [CatalogVehicleController::class, 'filters']);
// Va al final del grupo para que `featured` no se interprete como un id.
Route::get('/catalog/vehicles/{vehicle}', [CatalogVehicleController::class, 'show']);

Route::get('/marketplace/parts', [MarketplacePartController::class, 'index']);
Route::get('/marketplace/parts/{part}', [MarketplacePartController::class, 'show']);

Route::get('/banners', [BannerController::class, 'index']);

// Buscador guiado por pasos.
Route::get('/vehicles/brands', [SearchController::class, 'brands']);
Route::get('/vehicles/models', [SearchController::class, 'models']);
Route::get('/vehicles/years', [SearchController::class, 'years']);
Route::get('/parts/compatible', [SearchController::class, 'compatibleParts']);

// Formularios públicos de cotización: escritura anónima, por eso el límite bajo.
Route::post('/quote-requests', [QuoteRequestController::class, 'store'])
    ->middleware('throttle:10,1');

/* ----------------------------------------------------------------- Panel -- */

Route::middleware(['auth:sanctum', 'staff'])->prefix('admin')->group(function (): void {
    // Catálogo de vehículos.
    Route::get('/catalog/vehicles', [VehicleController::class, 'index']);
    Route::post('/catalog/vehicles', [VehicleController::class, 'store']);
    Route::get('/catalog/vehicles/{vehicle}', [VehicleController::class, 'show']);
    Route::put('/catalog/vehicles/{vehicle}', [VehicleController::class, 'update']);
    Route::post('/catalog/vehicles/{vehicle}/restore', [VehicleController::class, 'restore']);
    // Para reservar el borrado a administradores basta con añadir aquí
    // ->middleware('role:admin') (el middleware ya está registrado).
    Route::delete('/catalog/vehicles/{vehicle}', [VehicleController::class, 'destroy']);

    // Marketplace de autopartes.
    Route::get('/marketplace/parts', [PartController::class, 'index']);
    Route::post('/marketplace/parts', [PartController::class, 'store']);
    Route::get('/marketplace/parts/{part}', [PartController::class, 'show']);
    Route::put('/marketplace/parts/{part}', [PartController::class, 'update']);
    Route::patch('/marketplace/parts/{part}/stock', [PartController::class, 'updateStock']);
    Route::delete('/marketplace/parts/{part}', [PartController::class, 'destroy']);

    // Banners promocionales. `reorder` va antes que `{banner}` para que no se
    // confunda con un identificador.
    Route::get('/banners', [AdminBannerController::class, 'index']);
    Route::post('/banners', [AdminBannerController::class, 'store']);
    Route::patch('/banners/reorder', [AdminBannerController::class, 'reorder']);
    Route::patch('/banners/{banner}/active', [AdminBannerController::class, 'toggleActive']);
    Route::put('/banners/{banner}', [AdminBannerController::class, 'update']);
    Route::delete('/banners/{banner}', [AdminBannerController::class, 'destroy']);

    // Bandeja de cotizaciones.
    Route::get('/quote-requests', [AdminQuoteRequestController::class, 'index']);
    Route::patch('/quote-requests/{quoteRequest}/status', [AdminQuoteRequestController::class, 'updateStatus']);
    Route::delete('/quote-requests/{quoteRequest}', [AdminQuoteRequestController::class, 'destroy']);

    // Inventario operativo y tablero.
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::post('/inventory', [InventoryController::class, 'store']);
    Route::patch('/inventory/{item}/stock', [InventoryController::class, 'updateStock']);
    Route::get('/analytics', AnalyticsController::class);
});
