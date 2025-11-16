<?php

namespace Database\Seeders\Treasury;

use App\Models\Treasury\Client;
use App\Models\Treasury\CurrentAccountMovement;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        // Crear 50 clientes con Factory
        Client::factory()->count(50)->create()->each(function ($client) {
            // Crear movimiento inicial en cuenta corriente para cada cliente
            CurrentAccountMovement::create([
                'client_id' => $client->id,
                'fecha' => now(),
                'concepto' => 'Apertura de cuenta corriente',
                'detalle' => 'Saldo inicial',
                'debe' => 0,
                'haber' => 0,
                'saldo' => 0,
            ]);
        });

        // Crear algunos clientes específicos de prueba
        $clientes = [
            [
                'nombre' => 'Test',
                'apellido' => 'Cliente',
                'documento' => '20-99999999-9',
                'es_cliente' => true,
            ],
            [
                'nombre' => 'Proveedor',
                'apellido' => 'Test',
                'documento' => '27-88888888-8',
                'es_proveedor' => true,
            ],
            [
                'nombre' => 'Empresa',
                'apellido' => 'SA',
                'documento' => '30-77777777-7',
                'tipo_persona' => 'juridica',
                'es_cliente' => true,
                'es_proveedor' => true,
            ],
        ];

        foreach ($clientes as $data) {
            $client = Client::factory()->create($data);
            
            // Crear movimiento inicial
            CurrentAccountMovement::create([
                'client_id' => $client->id,
                'fecha' => now(),
                'concepto' => 'Apertura de cuenta corriente',
                'detalle' => 'Saldo inicial',
                'debe' => 0,
                'haber' => 0,
                'saldo' => 0,
            ]);
        }
    }
}
