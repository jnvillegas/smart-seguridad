<?php

namespace App\Services\Treasury;

use App\Models\Treasury\PaymentOrder;
use App\Models\Treasury\PaymentOrderValue;
use App\Models\Treasury\PaymentOrderWithholding;
use Illuminate\Support\Facades\DB;

class PaymentOrderService
{
    /**
     * Get all payment orders with filters
     */
    public function getAllWithFilters(array $filters)
    {
        $query = PaymentOrder::with(['supplier', 'user'])
            ->orderBy('created_at', 'desc');

        // Filtro por búsqueda
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('number', 'like', "%{$search}%")
                    ->orWhere('concept', 'like', "%{$search}%")
                    ->orWhereHas('supplier', function ($q) use ($search) {
                        $q->where('nombre', 'like', "%{$search}%")
                            ->orWhere('apellido', 'like', "%{$search}%");
                    });
            });
        }

        // Filtro por estado
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filtro por rango de fechas
        if (!empty($filters['start_date'])) {
            $query->whereDate('date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('date', '<=', $filters['end_date']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Create a new payment order
     */
    public function create(array $data): PaymentOrder
    {
        return DB::transaction(function () use ($data) {
            // Generar número automático
            $lastOrder = PaymentOrder::latest('id')->first();
            $nextNumber = $lastOrder ? intval(substr($lastOrder->number, 3)) + 1 : 1;
            $data['number'] = 'OP-' . str_pad($nextNumber, 8, '0', STR_PAD_LEFT);

            // Asignar usuario autenticado
            $data['user_id'] = auth()->id();

            // Calcular totales
            $subtotal = 0;
            $totalWithholdings = 0;

            if (!empty($data['values'])) {
                foreach ($data['values'] as $value) {
                    $subtotal += $value['amount'];
                }
            }

            if (!empty($data['withholdings'])) {
                foreach ($data['withholdings'] as $withholding) {
                    $totalWithholdings += $withholding['amount'];
                }
            }

            $data['subtotal'] = $subtotal;
            $data['total_withholdings'] = $totalWithholdings;
            $data['total'] = $subtotal;
            $data['amount_paid'] = $subtotal;
            $data['balance'] = 0;

            // Crear la orden de pago
            $paymentOrder = PaymentOrder::create($data);

            // Crear valores (medios de pago)
            if (!empty($data['values'])) {
                foreach ($data['values'] as $value) {
                    $paymentOrder->values()->create($value);
                }
            }

            // Crear retenciones
            if (!empty($data['withholdings'])) {
                foreach ($data['withholdings'] as $withholding) {
                    $paymentOrder->withholdings()->create($withholding);
                }
            }

            return $paymentOrder->load(['supplier', 'values', 'withholdings']);
        });
    }

    /**
     * Update an existing payment order
     */
    public function update(PaymentOrder $paymentOrder, array $data): PaymentOrder
    {
        return DB::transaction(function () use ($paymentOrder, $data) {
            // Calcular totales
            $subtotal = 0;
            $totalWithholdings = 0;

            if (!empty($data['values'])) {
                foreach ($data['values'] as $value) {
                    $subtotal += $value['amount'];
                }
            }

            if (!empty($data['withholdings'])) {
                foreach ($data['withholdings'] as $withholding) {
                    $totalWithholdings += $withholding['amount'];
                }
            }

            $data['subtotal'] = $subtotal;
            $data['total_withholdings'] = $totalWithholdings;
            $data['total'] = $subtotal;
            $data['amount_paid'] = $subtotal;
            $data['balance'] = 0;

            // Actualizar la orden
            $paymentOrder->update($data);

            // Actualizar valores
            $paymentOrder->values()->delete();
            if (!empty($data['values'])) {
                foreach ($data['values'] as $value) {
                    $paymentOrder->values()->create($value);
                }
            }

            // Actualizar retenciones
            $paymentOrder->withholdings()->delete();
            if (!empty($data['withholdings'])) {
                foreach ($data['withholdings'] as $withholding) {
                    $paymentOrder->withholdings()->create($withholding);
                }
            }

            return $paymentOrder->fresh(['supplier', 'values', 'withholdings']);
        });
    }

    /**
     * Cambiar estado de la orden
     */
    public function changeStatus(PaymentOrder $paymentOrder, string $newStatus): PaymentOrder
    {
        $oldStatus = $paymentOrder->status;

        // Validar transiciones de estado
        if ($oldStatus === 'cerrada' && $newStatus === 'en_proceso') {
            throw new \Exception('No se puede reabrir una orden cerrada');
        }

        if ($oldStatus === 'anulada') {
            throw new \Exception('No se puede modificar una orden anulada');
        }

        $paymentOrder->update(['status' => $newStatus]);

        return $paymentOrder->fresh();
    }

    /**
     * Delete a payment order
     */
    public function delete(PaymentOrder $paymentOrder): bool
    {
        return DB::transaction(function () use ($paymentOrder) {
            // Eliminar valores y retenciones
            $paymentOrder->values()->delete();
            $paymentOrder->withholdings()->delete();

            // Eliminar la orden
            return $paymentOrder->delete();
        });
    }
}

