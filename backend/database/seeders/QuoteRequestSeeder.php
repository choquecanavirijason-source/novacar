<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\QuoteStatus;
use App\Models\QuoteRequest;
use Illuminate\Database\Seeder;

/**
 * Bandeja de ejemplo para que el panel no arranque vacío.
 */
class QuoteRequestSeeder extends Seeder
{
    public function run(): void
    {
        if (QuoteRequest::query()->exists()) {
            return;
        }

        QuoteRequest::factory()->import()->create([
            'customer_email' => 'cliente.demo@example.com',
            'subject' => 'Toyota Corolla 2020',
            'amount' => 239_600,
            'created_at' => now()->subHours(26),
        ]);

        QuoteRequest::factory()->create([
            'customer_email' => 'otro.demo@example.com',
            'subject' => 'Batería BCI 35 — 600 CCA',
            'details' => 'Solicita disponibilidad, precio final y compatibilidad.',
            'status' => QuoteStatus::Contacted,
            'handled_at' => now()->subHour(),
            'created_at' => now()->subHours(3),
        ]);

        QuoteRequest::factory()->testDrive()->create([
            'customer_email' => 'prueba.demo@example.com',
            'created_at' => now()->subMinutes(45),
        ]);
    }
}
