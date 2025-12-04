<?php

namespace App\Services\Treasury;

use App\Models\Treasury\CashWithdrawal;
use Illuminate\Support\Facades\DB;

class CashWithdrawalService
{
    /**
     * Get all withdrawals with filters
     */
    public function getAllWithFilters(array $filters)
    {
        $query = CashWithdrawal::with(['user', 'cashRegister', 'costCenter'])
            ->orderBy('created_at', 'desc');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('number', 'like', "%{$search}%")
                    ->orWhere('recipient', 'like', "%{$search}%")
                    ->orWhere('reason', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['start_date'])) {
            $query->whereDate('date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('date', '<=', $filters['end_date']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Create a new withdrawal
     */
    public function create(array $data): CashWithdrawal
    {
        return DB::transaction(function () use ($data) {
            // Generar número automático
            $lastWithdrawal = CashWithdrawal::latest('id')->first();
            $nextNumber = $lastWithdrawal ? intval(substr($lastWithdrawal->number, 3)) + 1 : 1;
            $data['number'] = 'TE0' . str_pad($nextNumber, 8, '0', STR_PAD_LEFT);

            $data['user_id'] = auth()->id();

            // Calcular total desde items
            $total = 0;
            if (!empty($data['items'])) {
                foreach ($data['items'] as $item) {
                    $total += $item['amount'];
                }
            }
            $data['total'] = $total;

            $withdrawal = CashWithdrawal::create($data);

            // Crear items
            if (!empty($data['items'])) {
                foreach ($data['items'] as $item) {
                    $withdrawal->items()->create($item);
                }
            }

            return $withdrawal->load(['items', 'user', 'cashRegister', 'costCenter']);
        });
    }

    /**
     * Update withdrawal
     */
    public function update(CashWithdrawal $withdrawal, array $data): CashWithdrawal
    {
        return DB::transaction(function () use ($withdrawal, $data) {
            // Calcular total
            $total = 0;
            if (!empty($data['items'])) {
                foreach ($data['items'] as $item) {
                    $total += $item['amount'];
                }
            }
            $data['total'] = $total;

            $withdrawal->update($data);

            // Actualizar items
            $withdrawal->items()->delete();
            if (!empty($data['items'])) {
                foreach ($data['items'] as $item) {
                    $withdrawal->items()->create($item);
                }
            }

            return $withdrawal->fresh(['items', 'user', 'cashRegister', 'costCenter']);
        });
    }

    /**
     * Change status
     */
    public function changeStatus(CashWithdrawal $withdrawal, string $newStatus): CashWithdrawal
    {
        if ($withdrawal->status === 'anulado') {
            throw new \Exception('No se puede modificar un egreso anulado');
        }

        $withdrawal->update(['status' => $newStatus]);

        return $withdrawal->fresh();
    }

    /**
     * Delete withdrawal
     */
    public function delete(CashWithdrawal $withdrawal): bool
    {
        return DB::transaction(function () use ($withdrawal) {
            $withdrawal->items()->delete();
            return $withdrawal->delete();
        });
    }
}
