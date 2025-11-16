<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CurrentAccountMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'fecha',
        'concepto',
        'detalle',
        'debe',
        'haber',
        'saldo',
        'documento_tipo',
        'documento_id',
    ];

    protected $casts = [
        'fecha' => 'date',
        'debe' => 'decimal:2',
        'haber' => 'decimal:2',
        'saldo' => 'decimal:2',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function documento(): MorphTo
    {
        return $this->morphTo();
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($movement) {
            // Calcular saldo automáticamente
            $lastMovement = static::where('client_id', $movement->client_id)
                ->latest('id')
                ->first();

            $previousBalance = $lastMovement ? $lastMovement->saldo : 0;
            $movement->saldo = $previousBalance + $movement->debe - $movement->haber;
        });

        static::created(function ($movement) {
            // Actualizar saldo del cliente
            $movement->client->updateBalance();
        });

        static::deleted(function ($movement) {
            // Recalcular saldos posteriores
            $movement->client->updateBalance();
        });
    }
}

