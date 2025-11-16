<?php

namespace App\Http\Controllers\Treasury;

use App\Http\Controllers\Controller;
use App\Http\Requests\Treasury\StoreClientTaxRequest;
use App\Models\Treasury\Client;
use App\Services\Treasury\ClientService;
use Illuminate\Http\JsonResponse;

class ClientTaxController extends Controller
{
    protected $clientService;

    public function __construct(ClientService $clientService)
    {
        $this->clientService = $clientService;
    }

    /**
     * GET /clients/{id}/taxes
     * Listar impuestos de un cliente
     */
    public function index(Client $client): JsonResponse
    {
        $taxes = $client->taxes()->with('tax')->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $taxes,
            'message' => 'Impuestos obtenidos correctamente'
        ]);
    }

    /**
     * POST /clients/{id}/taxes
     * Agregar impuesto a un cliente
     */
    public function store(StoreClientTaxRequest $request, Client $client): JsonResponse
    {
        try {
            $tax = $this->clientService->attachTax($client, $request->validated());

            return response()->json([
                'success' => true,
                'data' => $tax->load('tax'),
                'message' => 'Impuesto agregado correctamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * PUT /clients/{client}/taxes/{tax}
     * Actualizar impuesto de un cliente
     */
    public function update(StoreClientTaxRequest $request, Client $client, $taxId): JsonResponse
    {
        try {
            $tax = $this->clientService->updateTax($client, $taxId, $request->validated());

            return response()->json([
                'success' => true,
                'data' => $tax->load('tax'),
                'message' => 'Impuesto actualizado correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * DELETE /clients/{client}/taxes/{tax}
     * Eliminar impuesto de un cliente
     */
    public function destroy(Client $client, $taxId): JsonResponse
    {
        try {
            $this->clientService->detachTax($client, $taxId);

            return response()->json([
                'success' => true,
                'message' => 'Impuesto eliminado correctamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
