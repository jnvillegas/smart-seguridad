<?php

namespace App\Services\Treasury;

use App\Models\Treasury\BankAccount;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class BankAccountService
{
    public function getAllPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = BankAccount::query()->with('bankEntity');

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['tipo_cuenta'])) {
            $query->byType($filters['tipo_cuenta']);
        }

        if (!empty($filters['moneda'])) {
            $query->byCurrency($filters['moneda']);
        }

        if (isset($filters['activa'])) {
            $query->where('activa', $filters['activa']);
        }

        if (!empty($filters['bank_entity_id'])) {
            $query->where('bank_entity_id', $filters['bank_entity_id']);
        }

        return $query->orderBy('numero_cuenta')->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return BankAccount::active()->with('bankEntity')->orderBy('numero_cuenta')->get();
    }

    public function findById(int $id): BankAccount
    {
        return BankAccount::with('bankEntity')->findOrFail($id);
    }

    public function create(array $data): BankAccount
    {
        $account = BankAccount::create($data);
        return $account->load('bankEntity');
    }

    public function update(BankAccount $account, array $data): bool
    {
        return $account->update($data);
    }

    public function delete(BankAccount $account): bool
    {
        return $account->delete();
    }

    public function toggleStatus(BankAccount $account): bool
    {
        return $account->update(['activa' => !$account->activa]);
    }

    public function updateBalance(BankAccount $account, float $amount): bool
    {
        $newBalance = $account->saldo_actual + $amount;
        return $account->update(['saldo_actual' => $newBalance]);
    }
}
