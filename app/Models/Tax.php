<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tax extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'codigo',
        'tipo',
        'porcentaje_default',
        'activo',
    ];

    protected $casts = [
        'porcentaje_default' => 'decimal:2',
        'activo' => 'boolean',
    ];

    public function clientTaxes(): HasMany
    {
        return $this->hasMany(\App\Models\Treasury\ClientTax::class);
    }
}
