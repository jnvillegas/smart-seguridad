<?php

namespace App\Observers;

use App\Models\Treasury\Client;
use App\Models\Treasury\CurrentAccountMovement;
use Illuminate\Support\Facades\Log;

class ClientObserver
{
    /**
     * Handle the Client "creating" event.
     * Se ejecuta ANTES de guardar el cliente en la BD
     */
    public function creating(Client $client): void
    {
        // Generar código interno automáticamente si no existe
        if (!$client->codigo_interno) {
            $client->codigo_interno = Client::generateClientCode();
            Log::info('Código interno generado automáticamente', [
                'codigo' => $client->codigo_interno,
                'nombre' => $client->nombre,
            ]);
        }

        // Calcular edad automáticamente si tiene fecha de nacimiento
        if ($client->fecha_nacimiento) {
            $client->edad = \Carbon\Carbon::parse($client->fecha_nacimiento)->age;
        }
    }

    /**
     * Handle the Client "created" event.
     * Se ejecuta DESPUÉS de guardar el cliente en la BD
     */
    public function created(Client $client): void
    {
        // Crear movimiento inicial en cuenta corriente
        CurrentAccountMovement::create([
            'client_id' => $client->id,
            'fecha' => now(),
            'concepto' => 'Apertura de cuenta corriente',
            'detalle' => 'Cuenta corriente abierta automáticamente',
            'debe' => 0,
            'haber' => 0,
            'saldo' => 0,
        ]);

        Log::info('Cliente creado con éxito', [
            'client_id' => $client->id,
            'codigo' => $client->codigo_interno,
            'nombre' => $client->full_name,
            'email' => $client->email,
        ]);
    }

    /**
     * Handle the Client "updating" event.
     * Se ejecuta ANTES de actualizar el cliente
     */
    public function updating(Client $client): void
    {
        // Si cambió la fecha de nacimiento, recalcular edad
        if ($client->isDirty('fecha_nacimiento') && $client->fecha_nacimiento) {
            $client->edad = \Carbon\Carbon::parse($client->fecha_nacimiento)->age;
            
            Log::info('Edad recalculada', [
                'client_id' => $client->id,
                'nueva_edad' => $client->edad,
            ]);
        }

        // Registrar cambios importantes
        if ($client->isDirty('email')) {
            Log::warning('Email del cliente modificado', [
                'client_id' => $client->id,
                'email_anterior' => $client->getOriginal('email'),
                'email_nuevo' => $client->email,
            ]);
        }

        if ($client->isDirty('documento')) {
            Log::warning('Documento del cliente modificado', [
                'client_id' => $client->id,
                'documento_anterior' => $client->getOriginal('documento'),
                'documento_nuevo' => $client->documento,
            ]);
        }
    }

    /**
     * Handle the Client "updated" event.
     * Se ejecuta DESPUÉS de actualizar el cliente
     */
    public function updated(Client $client): void
    {
        Log::info('Cliente actualizado', [
            'client_id' => $client->id,
            'cambios' => $client->getChanges(),
            'codigo' => $client->codigo_interno,
        ]);
    }

    /**
     * Handle the Client "deleting" event.
     * Se ejecuta ANTES de eliminar el cliente (soft delete)
     */
    public function deleting(Client $client): void
    {
        // Validación: no permitir eliminar si tiene saldo pendiente
        if ($client->saldo != 0) {
            throw new \Exception(
                "No se puede eliminar el cliente {$client->full_name} " .
                "porque tiene un saldo pendiente de " . abs($client->saldo)
            );
        }

        // Validación: no permitir eliminar si tiene movimientos pendientes
        if ($client->hasPendingMovements()) {
            throw new \Exception(
                "No se puede eliminar el cliente {$client->full_name} " .
                "porque tiene movimientos en su cuenta corriente"
            );
        }

        Log::warning('Cliente marcado para eliminar', [
            'client_id' => $client->id,
            'codigo' => $client->codigo_interno,
            'nombre' => $client->full_name,
        ]);
    }

    /**
     * Handle the Client "deleted" event.
     * Se ejecuta DESPUÉS de eliminar el cliente (soft delete)
     */
    public function deleted(Client $client): void
    {
        Log::info('Cliente eliminado (soft delete)', [
            'client_id' => $client->id,
            'codigo' => $client->codigo_interno,
            'nombre' => $client->full_name,
        ]);
    }

    /**
     * Handle the Client "restoring" event.
     * Se ejecuta ANTES de restaurar un cliente eliminado
     */
    public function restoring(Client $client): void
    {
        Log::info('Cliente siendo restaurado', [
            'client_id' => $client->id,
            'codigo' => $client->codigo_interno,
        ]);
    }

    /**
     * Handle the Client "restored" event.
     * Se ejecuta DESPUÉS de restaurar un cliente eliminado
     */
    public function restored(Client $client): void
    {
        Log::info('Cliente restaurado correctamente', [
            'client_id' => $client->id,
            'codigo' => $client->codigo_interno,
            'nombre' => $client->full_name,
        ]);
    }

    /**
     * Handle the Client "forceDeleted" event.
     * Se ejecuta DESPUÉS de eliminar permanentemente un cliente (sin soft delete)
     */
    public function forceDeleted(Client $client): void
    {
        Log::warning('Cliente eliminado permanentemente', [
            'client_id' => $client->id,
            'codigo' => $client->codigo_interno,
            'nombre' => $client->full_name,
        ]);
    }
}
