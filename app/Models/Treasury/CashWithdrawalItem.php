<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashWithdrawalItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cash_withdrawal_id',
        'concept',
        'observation',
        'amount',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function withdrawal()
    {
        return $this->belongsTo(CashWithdrawal::class, 'cash_withdrawal_id');
    }
}
