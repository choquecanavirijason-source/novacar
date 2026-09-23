<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\MarketplaceController;
use App\Http\Controllers\Api\QuoteRequestController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');
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
Route::get('/banners', [BannerController::class, 'index']);
Route::post('/quote-requests', [QuoteRequestController::class, 'store'])->middleware('throttle:10,1');

Route::middleware(['auth:sanctum', 'role:admin,operator'])->prefix('admin')->group(function () {
    Route::get('/inventory', [AdminController::class, 'inventory']);
    Route::post('/inventory', [AdminController::class, 'store']);
    Route::get('/analytics', [AdminController::class, 'analytics']);
    Route::patch('/inventory/{id}/stock', [AdminController::class, 'updateStock']);

    Route::post('/catalog/vehicles', [CatalogController::class, 'store']);
    Route::put('/catalog/vehicles/{id}', [CatalogController::class, 'update']);
    Route::delete('/catalog/vehicles/{id}', [CatalogController::class, 'destroy']);

    Route::get('/banners', [BannerController::class, 'adminIndex']);
    Route::post('/banners', [BannerController::class, 'store']);
    Route::put('/banners/{id}', [BannerController::class, 'update']);
    Route::patch('/banners/{id}/active', [BannerController::class, 'toggleActive']);
    Route::patch('/banners/reorder', [BannerController::class, 'reorder']);
    Route::delete('/banners/{id}', [BannerController::class, 'destroy']);

    Route::post('/marketplace/parts', [MarketplaceController::class, 'store']);
    Route::put('/marketplace/parts/{id}', [MarketplaceController::class, 'update']);
    Route::delete('/marketplace/parts/{id}', [MarketplaceController::class, 'destroy']);

    Route::get('/quote-requests', [QuoteRequestController::class, 'adminIndex']);
    Route::patch('/quote-requests/{id}/status', [QuoteRequestController::class, 'updateStatus']);
    Route::delete('/quote-requests/{id}', [QuoteRequestController::class, 'destroy']);
});