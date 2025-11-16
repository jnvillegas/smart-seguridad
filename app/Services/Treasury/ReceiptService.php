<?php

namespace App\Services\Treasury;

use App\Models\Treasury\Receipt;
use App\Models\Treasury\ReceiptItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReceiptService
{
    /**
     * Crear recibo
     */
    public function createReceipt(array $data): Receipt
    {
        return DB::transaction(function () use ($data) {
            // Generar número de recibo
            $lastReceipt = Receipt::orderBy('id', 'desc')->first();
            $nextNumber = ($lastReceipt ? (int)explode('-', $lastReceipt->numero_recibo)[1] : 0) + 1;
            $numeroRecibo = 'REC-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

            // Calcular totales
            $subtotal = 0;
            $items = $data['items'] ?? [];

            foreach ($items as $item) {
                $item['subtotal'] = $item['cantidad'] * $item['precio_unitario'];
                $subtotal += $item['subtotal'];
            }

            $impuesto = isset($data['impuesto']) ? (float)$data['impuesto'] : 0;
            $total = $subtotal + $impuesto;

            // Crear recibo
            $receipt = Receipt::create([
                'client_id' => $data['client_id'],
                'numero_recibo' => $numeroRecibo,
                'fecha_recibo' => $data['fecha_recibo'] ?? now()->toDateString(),
                'estado' => $data['estado'] ?? 'pendiente',
                'subtotal' => $subtotal,
                'impuesto' => $impuesto,
                'total' => $total,
                'referencia' => $data['referencia'] ?? null,
                'concepto' => $data['concepto'] ?? null,
                'observaciones' => $data['observaciones'] ?? null,
                'metodo_pago' => $data['metodo_pago'] ?? 'efectivo',
            ]);

            // Crear items
            foreach ($items as $item) {
                ReceiptItem::create([
                    'receipt_id' => $receipt->id,
                    'descripcion' => $item['descripcion'],
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

            Log::info('Recibo creado', [
                'receipt_id' => $receipt->id,
                'numero' => $numeroRecibo,
                'total' => $total,
            ]);

            return $receipt;
        });
    }

    /**
     * Actualizar recibo
     */
    public function updateReceipt(Receipt $receipt, array $data): Receipt
    {
        return DB::transaction(function () use ($receipt, $data) {
            // Calcular totales
            $subtotal = 0;
            $items = $data['items'] ?? [];

            foreach ($items as $item) {
                if (!isset($item['id'])) {
                    $item['subtotal'] = $item['cantidad'] * $item['precio_unitario'];
                }
                $subtotal += $item['subtotal'];
            }

            $impuesto = isset($data['impuesto']) ? (float)$data['impuesto'] : 0;
            $total = $subtotal + $impuesto;

            // Actualizar recibo
            $receipt->update([
                'client_id' => $data['client_id'],
                'fecha_recibo' => $data['fecha_recibo'],
                'estado' => $data['estado'],
                'subtotal' => $subtotal,
                'impuesto' => $impuesto,
                'total' => $total,
                'referencia' => $data['referencia'] ?? null,
                'concepto' => $data['concepto'] ?? null,
                'observaciones' => $data['observaciones'] ?? null,
                'metodo_pago' => $data['metodo_pago'],
            ]);

            // Eliminar items anteriores
            $receipt->items()->delete();

            // Crear nuevos items
            foreach ($items as $item) {
                ReceiptItem::create([
                    'receipt_id' => $receipt->id,
                    'descripcion' => $item['descripcion'],
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario'],
                    'subtotal' => $item['cantidad'] * $item['precio_unitario'],
                ]);
            }

            Log::info('Recibo actualizado', ['receipt_id' => $receipt->id]);

            return $receipt;
        });
    }

    /**
     * Eliminar recibo
     */
    public function deleteReceipt(Receipt $receipt): bool
    {
        return DB::transaction(function () use ($receipt) {
            Log::info('Recibo eliminado', ['receipt_id' => $receipt->id]);
            return $receipt->delete();
        });
    }
}

