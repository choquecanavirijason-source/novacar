<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\MarketplaceController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::get('/vehicles/brands', [SearchController::class, 'brands']);
Route::get('/vehicles/models', [SearchController::class, 'models']);
Route::get('/vehicles/years', [SearchController::class, 'years']);
Route::get('/parts/compatible', [SearchController::class, 'compatibleParts']);

Route::get('/catalog/vehicles', [CatalogController::class, 'index']);
Route::get('/catalog/vehicles/{id}', [CatalogController::class, 'show']);

Route::get('/marketplace/parts', [MarketplaceController::class, 'index']);
Route::get('/marketplace/parts/{id}', [MarketplaceController::class, 'show']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/inventory', [AdminController::class, 'inventory']);
    Route::get('/analytics', [AdminController::class, 'analytics']);
    Route::patch('/inventory/{id}/stock', [AdminController::class, 'updateStock']);
});