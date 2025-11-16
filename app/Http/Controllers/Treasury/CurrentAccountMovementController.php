<?php

namespace App\Http\Controllers\Treasury;

use App\Http\Controllers\Controller;
use App\Http\Requests\Treasury\StoreCurrentAccountMovementRequest;
use App\Models\Treasury\Client;
use App\Services\Treasury\ClientService;
use Illuminate\Http\JsonResponse;

class CurrentAccountMovementController extends Controller
{
    protected $clientService;

    public function __construct(ClientService $clientService)
    {
        $this->clientService = $clientService;
    }

    /**
     * GET /clients/{id}/movements
     * Listar movimientos de cuenta corriente
     */
    public function index(Client $client): JsonResponse
    {
        $movements = $client->currentAccountMovements()
            ->orderBy('fecha', 'desc')
            ->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $movements,
            'message' => 'Movimientos obtenidos correctamente'
        ]);
    }

    /**
     * POST /clients/{id}/movements
     * Crear movimiento de cuenta corriente
     */
    public function store(StoreCurrentAccountMovementRequest $request, Client $client): JsonResponse
    {
        try {
            $movement = $this->clientService->createMovement($client, $request->validated());

            return response()->json([
                'success' => true,
                'data' => $movement,
                'message' => 'Movimiento creado correctamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * GET /clients/{id}/movements/{movement}
     * Ver detalles de un movimiento
     */
    public function show(Client $client, $movementId): JsonResponse
    {
        $movement = $client->currentAccountMovements()->findOrFail($movementId);

        return response()->json([
            'success' => true,
            'data' => $movement,
            'message' => 'Movimiento obtenido correctamente'
        ]);
    }
}
