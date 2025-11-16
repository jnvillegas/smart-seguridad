<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Receipt extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'receipts';

    protected $fillable = [
        'client_id',
        'numero_recibo',
        'fecha_recibo',
        'estado',
        'subtotal',
        'impuesto',
        'total',
        'referencia',
        'concepto',
        'observaciones',
        'metodo_pago',
    ];

    protected $casts = [
        'fecha_recibo' => 'date',
        'subtotal' => 'decimal:2',
        'impuesto' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    // Relaciones
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ReceiptItem::class);
    }

    // Scopes
    public function scopeSearch($query, $search)
    {
        return $query->where('numero_recibo', 'like', "%{$search}%")
                     ->orWhereHas('client', function ($q) use ($search) {
                         $q->where('nombre', 'like', "%{$search}%")
                           ->orWhere('apellido', 'like', "%{$search}%");
                     });
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('estado', $status);
    }
}
