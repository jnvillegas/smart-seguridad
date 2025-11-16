<?php

namespace App\Http\Controllers\Treasury;

use App\Http\Controllers\Controller;
use App\Http\Requests\Treasury\StoreClientCertificateRequest;
use App\Models\Treasury\Client;
use App\Services\Treasury\ClientService;
use Illuminate\Http\JsonResponse;

class ClientCertificateController extends Controller
{
    protected $clientService;

    public function __construct(ClientService $clientService)
    {
        $this->clientService = $clientService;
    }

    /**
     * GET /clients/{id}/certificates
     * Listar certificados de un cliente
     */
    public function index(Client $client): JsonResponse
    {
        $certificates = $client->certificates()->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $certificates,
            'message' => 'Certificados obtenidos correctamente'
        ]);
    }

    /**
     * POST /clients/{id}/certificates
     * Agregar certificado a un cliente
     */
    public function store(StoreClientCertificateRequest $request, Client $client): JsonResponse
    {
        try {
            $certificate = $this->clientService->attachCertificate($client, $request->validated());

            return response()->json([
                'success' => true,
                'data' => $certificate,
                'message' => 'Certificado agregado correctamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * PUT /clients/{client}/certificates/{cert}
     * Actualizar certificado
     */
    public function update(StoreClientCertificateRequest $request, Client $client, $certId): JsonResponse
    {
        try {
            $certificate = $this->clientService->updateCertificate($client, $certId, $request->validated());

            return response()->json([
                'success' => true,
                'data' => $certificate,
                'message' => 'Certificado actualizado correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * DELETE /clients/{client}/certificates/{cert}
     * Eliminar certificado
     */
    public function destroy(Client $client, $certId): JsonResponse
    {
        try {
            $this->clientService->deleteCertificate($client, $certId);

            return response()->json([
                'success' => true,
                'message' => 'Certificado eliminado correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}

