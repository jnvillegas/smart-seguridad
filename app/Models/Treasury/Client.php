<?php

namespace App\Models\Treasury;

use App\Enums\Treasury\TaxCategory;
use App\Enums\Treasury\DocumentType;
use App\Enums\Treasury\PersonType;
use App\Enums\Treasury\IIBBType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nombre',
        'apellido',
        'documento',
        'tipo_documento',
        'tipo_persona',
        'nombre_fantasia',
        'codigo_interno',
        'es_cliente',
        'es_proveedor',
        'categoria_fiscal',
        'persona_tipo_iibb',
        'nro_ingresos_brutos',
        'gran_contribuyente',
        'domicilio',
        'barrio',
        'localidad',
        'telefono',
        'celular',
        'email',
        'contacto',
        'fecha_nacimiento',
        'edad',
        'estado_civil',
        'genero',
        'cuenta_contable_id',
        'observaciones',
    ];

    protected $casts = [
        'es_cliente' => 'boolean',
        'es_proveedor' => 'boolean',
        'gran_contribuyente' => 'boolean',
        'categoria_fiscal' => TaxCategory::class,
        'tipo_documento' => DocumentType::class,
        'tipo_persona' => PersonType::class,
        'persona_tipo_iibb' => IIBBType::class,
        'saldo' => 'decimal:2',
        'fecha_nacimiento' => 'date',
    ];

    protected $appends = ['full_name'];

    // Relaciones
    public function taxes(): HasMany
    {
        return $this->hasMany(ClientTax::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(ClientCertificate::class);
    }

    public function currentAccountMovements(): HasMany
    {
        return $this->hasMany(CurrentAccountMovement::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(ClientAttachment::class);
    }

    public function accountingAccount(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Accounting\AccountingAccount::class, 'cuenta_contable_id');
    }

    // Accessors & Mutators
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => trim("{$this->nombre} {$this->apellido}")
        );
    }

    // Métodos de negocio
    public function calculateBalance(): float
    {
        $balance = $this->currentAccountMovements()
            ->selectRaw('SUM(debe) - SUM(haber) as balance')
            ->value('balance');

        return (float) ($balance ?? 0);
    }

    public function updateBalance(): void
    {
        $this->update(['saldo' => $this->calculateBalance()]);
    }

    public function hasActiveCertificate(string $tipo): bool
    {
        return $this->certificates()
            ->where('tipo_certificado', $tipo)
            ->where('fecha_vencimiento', '>=', now())
            ->exists();
    }

    public function getExpiringCertificates(int $daysAhead = 2): \Illuminate\Database\Eloquent\Collection
    {
        return $this->certificates()
            ->where('fecha_vencimiento', '>=', now())
            ->where('fecha_vencimiento', '<=', now()->addDays($daysAhead))
            ->get();
    }

    public function hasPendingMovements(): bool
    {
        return $this->currentAccountMovements()
            ->where(function ($query) {
                $query->where('debe', '!=', 0)
                      ->orWhere('haber', '!=', 0);
            })
            ->exists();
    }

    // Scopes
    public function scopeClients($query)
    {
        return $query->where('es_cliente', true);
    }

    public function scopeProviders($query)
    {
        return $query->where('es_proveedor', true);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nombre', 'like', "%{$search}%")
              ->orWhere('apellido', 'like', "%{$search}%")
              ->orWhere('documento', 'like', "%{$search}%")
              ->orWhere('codigo_interno', 'like', "%{$search}%");
        });
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($client) {
            if (!$client->codigo_interno) {
                $client->codigo_interno = static::generateClientCode();
            }

            if ($client->fecha_nacimiento) {
                $client->edad = Carbon::parse($client->fecha_nacimiento)->age;
            }
        });

        static::updating(function ($client) {
            if ($client->isDirty('fecha_nacimiento') && $client->fecha_nacimiento) {
                $client->edad = Carbon::parse($client->fecha_nacimiento)->age;
            }
        });
    }

    public static function generateClientCode(): string
    {
        $lastClient = static::withTrashed()->latest('id')->first();
        $nextId = $lastClient ? $lastClient->id + 1 : 1;
        
        return 'CLI-' . str_pad($nextId, 6, '0', STR_PAD_LEFT);
    }
}
