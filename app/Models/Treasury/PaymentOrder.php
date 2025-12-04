<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Treasury\Client;
use App\Models\User;

class PaymentOrder extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'supplier_id',
        'user_id',
        'branch_office_id',
        'cash_register_id',
        'cost_center_id',
        'number',
        'date',
        'concept',
        'detail',
        'status',
        'is_advance',
        'currency',
        'exchange_rate',
        'exchange_rate_date',
        'subtotal',
        'total_withholdings',
        'total',
        'amount_paid',
        'balance',
    ];

    protected $casts = [
        'date' => 'date',
        'exchange_rate_date' => 'date',
        'is_advance' => 'boolean',
        'exchange_rate' => 'decimal:4',
        'subtotal' => 'decimal:2',
        'total_withholdings' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    // Relaciones
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'supplier_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function values(): HasMany
    {
        return $this->hasMany(PaymentOrderValue::class);
    }

    public function withholdings(): HasMany
    {
        return $this->hasMany(PaymentOrderWithholding::class);
    }

    // Scopes
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('number', 'like', "%{$search}%")
              ->orWhere('concept', 'like', "%{$search}%")
              ->orWhere('detail', 'like', "%{$search}%")
              ->orWhereHas('supplier', function ($q) use ($search) {
                  $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('apellido', 'like', "%{$search}%");
              });
        });
    }

    public function scopeByStatus($query, $status)
    {
        if ($status && $status !== 'all') {
            return $query->where('status', $status);
        }
        return $query;
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }
        return $query;
    }

    // Accessors
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'en_proceso' => 'En Proceso',
            'cerrada' => 'Cerrada',
            'anulada' => 'Anulada',
            default => $this->status,
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'en_proceso' => 'warning',
            'cerrada' => 'success',
            'anulada' => 'danger',
            default => 'secondary',
        };
    }
}
