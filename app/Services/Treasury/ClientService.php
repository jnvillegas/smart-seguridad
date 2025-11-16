<?php

namespace App\Services\Treasury;

use App\Models\Treasury\Client;
use App\Models\Treasury\ClientTax;
use App\Models\Treasury\CurrentAccountMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ClientService
{
    /**
     * Crear un nuevo cliente
     */
    public function createClient(array $data): Client
    {
        return DB::transaction(function () use ($data) {
            // Crear cliente (el Observer creará el movimiento inicial)
            $client = Client::create($data);

            Log::info('Cliente creado via Service', [
                'client_id' => $client->id,
                'codigo' => $client->codigo_interno,
                'nombre' => $client->full_name,
                'user_id' => auth()->id(),
            ]);

            return $client;
        });
    }

    /**
     * Actualizar un cliente existente
     */
 /**
 * Actualizar cliente
 */
public function updateClient(Client $client, array $data): Client
{
    return DB::transaction(function () use ($client, $data) {
        $originalData = $client->getOriginal();
        $client->update($data);

        // Convertir Enums a string para el log
        $dataForLog = array_map(function ($value) {
            return $value instanceof \BackedEnum ? $value->value : $value;
        }, $data);

        $originalDataForLog = array_map(function ($value) {
            return $value instanceof \BackedEnum ? $value->value : $value;
        }, $originalData);

        Log::info('Cliente actualizado via Service', [
            'client_id' => $client->id,
            'cambios' => array_diff_assoc($dataForLog, $originalDataForLog),
            'user_id' => auth()->id(),
        ]);

        return $client;
    });
}


    /**
     * Eliminar un cliente (soft delete)
     */
    public function deleteClient(Client $client): bool
    {
        // Validación: no eliminar si tiene saldo pendiente
        if ($client->saldo != 0) {
            throw new \Exception(
                "No se puede eliminar el cliente {$client->full_name} " .
                "porque tiene un saldo pendiente de " . abs($client->saldo)
            );
        }

        // Validación: no eliminar si tiene movimientos
        if ($client->hasPendingMovements()) {
            throw new \Exception(
                "No se puede eliminar el cliente {$client->full_name} " .
                "porque tiene movimientos en su cuenta corriente"
            );
        }

        return DB::transaction(function () use ($client) {
            $client->delete();

            Log::warning('Cliente eliminado (soft delete) via Service', [
                'client_id' => $client->id,
                'codigo' => $client->codigo_interno,
                'nombre' => $client->full_name,
                'user_id' => auth()->id(),
            ]);

            return true;
        });
    }

    /**
     * Restaurar un cliente eliminado
     */
    public function restoreClient(Client $client): Client
    {
        return DB::transaction(function () use ($client) {
            $client->restore();

            Log::info('Cliente restaurado via Service', [
                'client_id' => $client->id,
                'codigo' => $client->codigo_interno,
                'user_id' => auth()->id(),
            ]);

            return $client;
        });
    }

    /**
     * Agregar un impuesto a un cliente
     */
    public function attachTax(Client $client, array $taxData): ClientTax
    {
        return DB::transaction(function () use ($client, $taxData) {
            $clientTax = $client->taxes()->create($taxData);

            Log::info('Impuesto asociado a cliente', [
                'client_id' => $client->id,
                'tax_id' => $taxData['tax_id'],
                'alcuota' => $taxData['alcuota'],
                'user_id' => auth()->id(),
            ]);

            return $clientTax;
        });
    }

    /**
     * Actualizar impuesto de un cliente
     */
    public function updateTax(Client $client, int $taxId, array $data): ClientTax
    {
        return DB::transaction(function () use ($client, $taxId, $data) {
            $tax = $client->taxes()->findOrFail($taxId);
            $tax->update($data);

            Log::info('Impuesto del cliente actualizado', [
                'client_id' => $client->id,
                'tax_id' => $taxId,
                'user_id' => auth()->id(),
            ]);

            return $tax;
        });
    }

    /**
     * Eliminar impuesto de un cliente
     */
    public function detachTax(Client $client, int $taxId): bool
    {
        return DB::transaction(function () use ($client, $taxId) {
            $tax = $client->taxes()->findOrFail($taxId);
            $tax->delete();

            Log::info('Impuesto eliminado del cliente', [
                'client_id' => $client->id,
                'tax_id' => $taxId,
                'user_id' => auth()->id(),
            ]);

            return true;
        });
    }

    /**
     * Agregar certificado a un cliente
     */
    public function attachCertificate(Client $client, array $certData): \App\Models\Treasury\ClientCertificate
    {
        return DB::transaction(function () use ($client, $certData) {
            $certificate = $client->certificates()->create($certData);

            Log::info('Certificado agregado a cliente', [
                'client_id' => $client->id,
                'tipo' => $certData['tipo_certificado'],
                'numero' => $certData['numero'],
                'user_id' => auth()->id(),
            ]);

            return $certificate;
        });
    }

    /**
     * Actualizar certificado de un cliente
     */
    public function updateCertificate(Client $client, int $certId, array $data): \App\Models\Treasury\ClientCertificate
    {
        return DB::transaction(function () use ($client, $certId, $data) {
            $certificate = $client->certificates()->findOrFail($certId);
            $certificate->update($data);

            Log::info('Certificado del cliente actualizado', [
                'client_id' => $client->id,
                'cert_id' => $certId,
                'user_id' => auth()->id(),
            ]);

            return $certificate;
        });
    }

    /**
     * Eliminar certificado de un cliente
     */
    public function deleteCertificate(Client $client, int $certId): bool
    {
        return DB::transaction(function () use ($client, $certId) {
            $certificate = $client->certificates()->findOrFail($certId);
            $certificate->delete();

            Log::info('Certificado eliminado del cliente', [
                'client_id' => $client->id,
                'cert_id' => $certId,
                'user_id' => auth()->id(),
            ]);

            return true;
        });
    }

    /**
     * Crear movimiento de cuenta corriente para un cliente
     */
    public function createMovement(Client $client, array $movementData): CurrentAccountMovement
    {
        return DB::transaction(function () use ($client, $movementData) {
            $movement = $client->currentAccountMovements()->create($movementData);

            Log::info('Movimiento de cuenta corriente creado', [
                'client_id' => $client->id,
                'movement_id' => $movement->id,
                'debe' => $movementData['debe'] ?? 0,
                'haber' => $movementData['haber'] ?? 0,
                'user_id' => auth()->id(),
            ]);

            return $movement;
        });
    }

    /**
     * Obtener información del saldo del cliente
     */
    public function getClientBalance(Client $client): array
    {
        $client->refresh(); // Refrescar datos
        
        $movements = $client->currentAccountMovements()
            ->orderBy('fecha', 'desc')
            ->limit(10)
            ->get();

        $totalDebe = $client->currentAccountMovements()->sum('debe');
        $totalHaber = $client->currentAccountMovements()->sum('haber');

        return [
            'saldo_actual' => (float) $client->saldo,
            'total_debe' => (float) $totalDebe,
            'total_haber' => (float) $totalHaber,
            'ultimos_movimientos' => $movements,
            'cantidad_movimientos' => $client->currentAccountMovements()->count(),
        ];
    }

    /**
     * Verificar certificados próximos a vencer
     */
    public function checkExpiringCertificates(int $daysAhead = 2): \Illuminate\Support\Collection
    {
        return Client::with('certificates')
            ->get()
            ->flatMap(function ($client) use ($daysAhead) {
                return $client->getExpiringCertificates($daysAhead)
                    ->map(fn($cert) => [
                        'client' => $client,
                        'certificate' => $cert,
                        'days_remaining' => $cert->days_until_expiration
                    ]);
            })
            ->filter();
    }

/**
 * Obtener clientes con filtros
 */
public function searchClients(
    ?string $search = null, 
    int $perPage = 50,
    string $sortBy = 'created_at',
    string $sortOrder = 'desc'
): \Illuminate\Pagination\LengthAwarePaginator
{
    $query = Client::query();

    if ($search) {
        $query->search($search);
    }

    $query->orderBy($sortBy, $sortOrder);

    return $query->paginate($perPage);
}


    /**
     * Obtener solo clientes (no proveedores)
     */
    public function getClients(int $perPage = 50): \Illuminate\Pagination\LengthAwarePaginator
    {
        return Client::clients()->paginate($perPage);
    }

    /**
     * Obtener solo proveedores
     */
    public function getProviders(int $perPage = 50): \Illuminate\Pagination\LengthAwarePaginator
    {
        return Client::providers()->paginate($perPage);
    }
}
