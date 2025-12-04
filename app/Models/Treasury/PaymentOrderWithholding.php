<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Tax;

class PaymentOrderWithholding extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_order_id',
        'tax_id',
        'percentage',
        'amount',
        'aliquot',
        'payment_commitment',
        'certificate_number',
    ];

    protected $casts = [
        'percentage' => 'decimal:2',
        'amount' => 'decimal:2',
        'aliquot' => 'decimal:2',
    ];

    // Relaciones
    public function paymentOrder(): BelongsTo
    {
        return $this->belongsTo(PaymentOrder::class);
    }

    public function tax(): BelongsTo
    {
        return $this->belongsTo(Tax::class);
    }
}
