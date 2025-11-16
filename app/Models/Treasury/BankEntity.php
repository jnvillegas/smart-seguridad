<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BankEntity extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'codigo_bcra',
        'cuit',
        'telefono',
        'email',
        'web',
        'direccion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function accounts(): HasMany
    {
        return $this->hasMany(BankAccount::class);
    }

    public function scopeActive($query)
    {
        return $query->where('activo', true);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nombre', 'like', "%{$search}%")
              ->orWhere('codigo_bcra', 'like', "%{$search}%")
              ->orWhere('cuit', 'like', "%{$search}%");
        });
    }
}
