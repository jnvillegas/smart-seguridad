<?php

namespace App\Http\Controllers\Treasury;

use App\Http\Controllers\Controller;
use App\Models\Treasury\Client;
use App\Models\Treasury\ClientAttachment;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ClientAttachmentController extends Controller
{
    /**
     * Store a newly uploaded file
     */
    public function store(Request $request, Client $client): RedirectResponse
    {
        $validated = $request->validate([
            'archivo' => ['required', 'file', 'max:10240', 'mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png'],
            'nombre' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            $file = $request->file('archivo');
            
            // Generar nombre único
            $fileName = time() . '_' . $file->getClientOriginalName();
            
            // Guardar archivo
            $path = $file->storeAs(
                "clients/{$client->id}/attachments",
                $fileName,
                'public'
            );

            // Crear registro en BD
            $client->attachments()->create([
                'nombre' => $validated['nombre'] ?? $file->getClientOriginalName(),
                'archivo_path' => $path,
                'archivo_type' => $file->getMimeType(),
                'archivo_size' => $file->getSize(),
                'uploaded_by' => auth()->id(),
            ]);

            return back()->with('success', 'Archivo subido correctamente');

        } catch (\Exception $e) {
            return back()->with('error', 'Error al subir archivo: ' . $e->getMessage());
        }
    }

    /**
     * Download the specified attachment
     */
    public function download(Client $client, ClientAttachment $attachment): StreamedResponse
    {
        if (!Storage::disk('public')->exists($attachment->archivo_path)) {
            abort(404, 'Archivo no encontrado');
        }

        return Storage::disk('public')->download(
            $attachment->archivo_path,
            $attachment->nombre
        );
    }

    /**
     * Remove the specified attachment
     */
    public function destroy(Client $client, ClientAttachment $attachment): RedirectResponse
    {
        try {
            $attachment->delete();

            return back()->with('success', 'Archivo eliminado correctamente');

        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar archivo: ' . $e->getMessage());
        }
    }
}
