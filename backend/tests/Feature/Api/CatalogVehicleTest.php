<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Enums\BodyType;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\VehicleCondition;
use App\Models\CatalogVehicle;
use App\Models\User;
use App\Models\VehicleFitment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogVehicleTest extends TestCase
{
    use RefreshDatabase;

    public function test_el_catalogo_publico_lista_vehiculos_sin_sesion(): void
    {
        CatalogVehicle::factory()->count(3)->create();

        $response = $this->getJson('/api/catalog/vehicles');

        $response->assertOk()->assertJsonCount(3);
        // Sin envoltura `data`: el frontend espera el arreglo plano.
        $response->assertJsonStructure([['id', 'brand', 'model', 'body_type', 'price', 'features']]);
    }

    public function test_el_detalle_de_un_vehiculo_inexistente_responde_404_con_codigo_de_error(): void
    {
        $this->getJson('/api/catalog/vehicles/no-existe')
            ->assertNotFound()
            ->assertJsonPath('error_code', 'vehicle_not_found');
    }

    public function test_los_filtros_del_catalogo_se_aplican_en_el_servidor(): void
    {
        CatalogVehicle::factory()->create(['brand' => 'Nissan', 'price' => 200_000]);
        CatalogVehicle::factory()->create(['brand' => 'Tesla', 'price' => 900_000]);

        $this->getJson('/api/catalog/vehicles?brand=Nissan')->assertOk()->assertJsonCount(1);
        $this->getJson('/api/catalog/vehicles?max_price=300000')->assertOk()->assertJsonCount(1);
    }

    public function test_un_visitante_anonimo_no_puede_crear_vehiculos(): void
    {
        $this->postJson('/api/admin/catalog/vehicles', [])->assertUnauthorized();
    }

    public function test_un_cliente_autenticado_no_entra_al_panel(): void
    {
        $this->actingAs(User::factory()->customer()->create())
            ->postJson('/api/admin/catalog/vehicles', $this->payload())
            ->assertForbidden()
            ->assertJsonPath('error_code', 'insufficient_role');
    }

    public function test_un_operador_publica_un_vehiculo_y_se_genera_su_slug(): void
    {
        $response = $this->actingAs(User::factory()->operator()->create())
            ->postJson('/api/admin/catalog/vehicles', $this->payload());

        $response->assertCreated()->assertJsonPath('id', 'nissan-versa-sense-2021');

        $this->assertDatabaseHas('catalog_vehicles', [
            'id' => 'nissan-versa-sense-2021',
            'brand' => 'Nissan',
        ]);
    }

    public function test_publicar_un_vehiculo_habilita_su_marca_en_el_buscador(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->postJson('/api/admin/catalog/vehicles', $this->payload())
            ->assertCreated();

        $this->assertTrue(
            VehicleFitment::query()
                ->where(['brand' => 'Nissan', 'model' => 'Versa Sense', 'year' => 2021])
                ->exists()
        );

        $this->getJson('/api/vehicles/brands')->assertOk()->assertJsonFragment(['Nissan']);
    }

    public function test_dos_vehiculos_identicos_no_colisionan_de_identificador(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->postJson('/api/admin/catalog/vehicles', $this->payload())->assertCreated();
        $this->actingAs($admin)->postJson('/api/admin/catalog/vehicles', $this->payload())
            ->assertCreated()
            ->assertJsonPath('id', 'nissan-versa-sense-2021-2');
    }

    public function test_un_vehiculo_nuevo_con_kilometraje_es_rechazado(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->postJson('/api/admin/catalog/vehicles', [
                ...$this->payload(),
                'condition' => VehicleCondition::Nuevo->value,
                'mileage_km' => 45_000,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('mileage_km');
    }

    public function test_el_precio_debe_ser_positivo(): void
    {
        $this->actingAs(User::factory()->admin()->create())
            ->postJson('/api/admin/catalog/vehicles', [...$this->payload(), 'price' => 0])
            ->assertStatus(422)
            ->assertJsonValidationErrors('price');
    }

    public function test_el_borrado_es_logico_y_devuelve_204(): void
    {
        $vehicle = CatalogVehicle::factory()->create();

        $this->actingAs(User::factory()->admin()->create())
            ->deleteJson("/api/admin/catalog/vehicles/{$vehicle->id}")
            ->assertNoContent();

        $this->assertSoftDeleted('catalog_vehicles', ['id' => $vehicle->id]);
        $this->getJson("/api/catalog/vehicles/{$vehicle->id}")->assertNotFound();
    }

    public function test_solo_se_devuelven_cuatro_destacados_en_el_home(): void
    {
        CatalogVehicle::factory()->count(6)->highlighted()->create();
        CatalogVehicle::factory()->count(2)->create();

        $this->getJson('/api/catalog/vehicles/featured')->assertOk()->assertJsonCount(4);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(): array
    {
        return [
            'brand' => 'Nissan',
            'model' => 'Versa Sense',
            'year' => 2021,
            'price' => 289_000,
            'tagline' => 'Sedán eficiente.',
            'body_type' => BodyType::Sedan->value,
            'fuel_type' => FuelType::Gasolina->value,
            'transmission' => TransmissionType::Automatica->value,
            'condition' => VehicleCondition::Seminuevo->value,
            'mileage_km' => 28_000,
            'horsepower' => 118,
            'seats' => 5,
            'features' => ['Cámara de reversa', 'Bluetooth'],
            'accent_from' => '#005f8f',
            'accent_to' => '#00aaff',
            'highlighted' => true,
        ];
    }
}
