<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentOrderValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_order_id',
        'payment_type',
        'amount',
        'currency',
        'exchange_rate',
        'check_number',
        'check_date',
        'bank_entity_id',
        'bank_account_id',
        'reference',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'exchange_rate' => 'decimal:4',
        'check_date' => 'date',
    ];

    // Relaciones
    public function paymentOrder(): BelongsTo
    {
        return $this->belongsTo(PaymentOrder::class);
    }

    public function bankEntity(): BelongsTo
    {
        return $this->belongsTo(BankEntity::class);
    }

    public function bankAccount(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class);
    }

    // Accessor
    public function getPaymentTypeLabelAttribute(): string
    {
        return match($this->payment_type) {
            'efectivo' => 'Efectivo',
            'cheque_propio' => 'Cheque Propio',
            'cheque_terceros' => 'Cheque de Terceros',
            'transferencia' => 'Transferencia Bancaria',
            'tarjeta' => 'Tarjeta de Crédito/Débito',
            'nota_credito' => 'Nota de Crédito',
            'nota_credito_interna' => 'Nota de Crédito Interna',
            'compensacion' => 'Compensación',
            default => $this->payment_type,
        };
    }
}
