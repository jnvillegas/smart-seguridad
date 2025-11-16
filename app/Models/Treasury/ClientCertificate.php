<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class ClientCertificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'tipo_certificado',
        'numero',
        'fecha_vencimiento',
        'alertado',
    ];

    protected $casts = [
        'fecha_vencimiento' => 'date',
        'alertado' => 'boolean',
    ];

    protected $appends = ['vigente', 'days_until_expiration'];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    // Accessors
    public function getVigenteAttribute(): bool
    {
        return $this->fecha_vencimiento >= now();
    }

    public function getDaysUntilExpirationAttribute(): int
    {
        return now()->diffInDays($this->fecha_vencimiento, false);
    }

    // Métodos
    public function isExpired(): bool
    {
        return $this->fecha_vencimiento < now();
    }

    public function isExpiringSoon(int $daysThreshold = 2): bool
    {
        $days = $this->days_until_expiration;
        return $days >= 0 && $days <= $daysThreshold;
    }
}
