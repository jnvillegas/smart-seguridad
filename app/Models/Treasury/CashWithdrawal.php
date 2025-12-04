<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashWithdrawal extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'date',
        'recipient',
        'reason',
        'detail',
        'cash_register_id',
        'cost_center_id',
        'user_id',
        'currency',
        'total',
        'status',
        'observations',
    ];

    protected $casts = [
        'date' => 'date',
        'total' => 'decimal:2',
    ];

    // Relación con ítems (conceptos adicionales)
    public function items()
    {
        return $this->hasMany(CashWithdrawalItem::class);
    }

    public function cashRegister()
    {
        return $this->belongsTo(\App\Models\Treasury\CashRegister::class, 'cash_register_id');
    }

    public function costCenter()
    {
        return $this->belongsTo(\App\Models\Treasury\CostCenter::class, 'cost_center_id');
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
