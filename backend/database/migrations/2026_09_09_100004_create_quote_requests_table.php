<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bandeja única de cotizaciones y consultas. La alimentan tres formularios
 * públicos (importación, consulta de autoparte y prueba de manejo) y la
 * gestiona el panel en ?tab=quotes.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_requests', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('source', 16);
            $table->string('customer_email');
            $table->string('subject');
            $table->text('details');
            // Monto estimado en centavos-enteros de la moneda local; solo lo
            // envía el formulario de importación.
            $table->unsignedBigInteger('amount')->nullable();
            $table->string('status', 16)->default('new');

            // Trazabilidad: qué operador atendió la solicitud y cuándo.
            $table->foreignId('handled_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('handled_at')->nullable();

            // Referencias opcionales al recurso que originó la solicitud.
            $table->string('vehicle_id')->nullable();
            $table->string('part_id')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at'], 'quote_requests_status_created_index');
            $table->index('source', 'quote_requests_source_index');
            $table->index('customer_email', 'quote_requests_customer_email_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_requests');
    }
};
