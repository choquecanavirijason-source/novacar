<?php

declare(strict_types=1);

namespace App\Providers;

use App\Events\MarketplacePartStockChanged;
use App\Events\QuoteRequestReceived;
use App\Listeners\DispatchQuoteRequestNotification;
use App\Listeners\LogLowStockAlert;
use App\Support\SlugGenerator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Registro de servicios.
     *
     * Los servicios de aplicación no necesitan binding explícito: el contenedor
     * los resuelve por autowiring a partir del type-hint del constructor. Solo
     * se declara lo que tiene un ciclo de vida propio.
     */
    public function register(): void
    {
        // Sin estado: una sola instancia sirve para todo el ciclo de petición.
        $this->app->singleton(SlugGenerator::class);
    }

    public function boot(): void
    {
        $this->configureModels();
        $this->configureResources();
        $this->registerDomainListeners();
    }

    /**
     * El frontend consume arrays JSON planos (`CatalogVehicleDTO[]`), no la
     * envoltura `{"data": [...]}` que Laravel añade por defecto.
     */
    private function configureResources(): void
    {
        JsonResource::withoutWrapping();
    }

    /**
     * Modo estricto de Eloquent fuera de producción: convierte en excepción los
     * errores que en desarrollo pasan desapercibidos (consultas N+1, atributos
     * inexistentes, asignaciones descartadas en silencio).
     */
    private function configureModels(): void
    {
        $strict = ! $this->app->isProduction();

        Model::preventLazyLoading($strict);
        Model::preventSilentlyDiscardingAttributes($strict);

        // Queda deliberadamente desactivado: las consultas de agregación del
        // tablero (`COUNT(*) as total`) devuelven atributos que no existen en
        // el esquema y son legítimos.
        Model::preventAccessingMissingAttributes(false);
    }

    /**
     * Reacciones a los eventos de dominio.
     *
     * Se declaran aquí, y no dentro de los servicios, para que la capa de
     * negocio no dependa del canal concreto (cola, log, correo).
     */
    private function registerDomainListeners(): void
    {
        Event::listen(QuoteRequestReceived::class, DispatchQuoteRequestNotification::class);
        Event::listen(MarketplacePartStockChanged::class, LogLowStockAlert::class);
    }
}
