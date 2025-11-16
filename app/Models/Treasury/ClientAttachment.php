<?php

namespace App\Models\Treasury;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class ClientAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'nombre',
        'archivo_path',
        'archivo_type',
        'archivo_size',
        'uploaded_by',
    ];

    protected $casts = [
        'archivo_size' => 'integer',
    ];

    protected $appends = ['file_size_formatted', 'download_url'];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'uploaded_by');
    }

    // Accessors
    public function getFileSizeFormattedAttribute(): string
    {
        $bytes = $this->archivo_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getDownloadUrlAttribute(): string
    {
        return Storage::url($this->archivo_path);
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($attachment) {
            Storage::delete($attachment->archivo_path);
        });
    }
}
