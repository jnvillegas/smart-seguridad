<?php

namespace App\Services\Treasury;

use App\Models\Treasury\BankEntity;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class BankEntityService
{
    public function getAllPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = BankEntity::query()->with('accounts');

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (isset($filters['activo'])) {
            $query->where('activo', $filters['activo']);
        }

        return $query->orderBy('nombre')->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return BankEntity::active()->orderBy('nombre')->get();
    }

    public function findById(int $id): BankEntity
    {
        return BankEntity::with('accounts')->findOrFail($id);
    }

    public function create(array $data): BankEntity
    {
        return BankEntity::create($data);
    }

    public function update(BankEntity $bankEntity, array $data): bool
    {
        return $bankEntity->update($data);
    }

    public function delete(BankEntity $bankEntity): bool
    {
        if ($bankEntity->accounts()->count() > 0) {
            throw new \Exception('No se puede eliminar una entidad bancaria con cuentas asociadas');
        }

        return $bankEntity->delete();
    }

    public function toggleStatus(BankEntity $bankEntity): bool
    {
        return $bankEntity->update(['activo' => !$bankEntity->activo]);
    }
}
