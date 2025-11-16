<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'bank_entity_id',
        'numero_cuenta',
        'cbu',
        'alias',
        'tipo_cuenta',
        'moneda',
        'saldo_inicial',
        'saldo_actual',
        'fecha_apertura',
        'activa',
        'observaciones',
    ];

    protected $casts = [
        'saldo_inicial' => 'decimal:2',
        'saldo_actual' => 'decimal:2',
        'fecha_apertura' => 'date',
        'activa' => 'boolean',
    ];

    public function bankEntity(): BelongsTo
    {
        return $this->belongsTo(BankEntity::class);
    }

    public function scopeActive($query)
    {
        return $query->where('activa', true);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('numero_cuenta', 'like', "%{$search}%")
              ->orWhere('cbu', 'like', "%{$search}%")
              ->orWhere('alias', 'like', "%{$search}%")
              ->orWhereHas('bankEntity', function ($query) use ($search) {
                  $query->where('nombre', 'like', "%{$search}%");
              });
        });
    }

    public function scopeByType($query, $type)
    {
        return $query->where('tipo_cuenta', $type);
    }

    public function scopeByCurrency($query, $currency)
    {
        return $query->where('moneda', $currency);
    }

    public function getFullNameAttribute()
    {
        return "{$this->bankEntity->nombre} - {$this->numero_cuenta}";
    }
}

