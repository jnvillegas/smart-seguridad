<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClientTax extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'tax_id',
        'fecha_actualizacion',
        'alcuota',
        'observaciones',
    ];

    protected $casts = [
        'fecha_actualizacion' => 'date',
        'alcuota' => 'decimal:2',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function tax(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Tax::class);
    }
}
