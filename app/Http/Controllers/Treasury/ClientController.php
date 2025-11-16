<?php

namespace App\Http\Controllers\Treasury;

use App\Http\Controllers\Controller;
use App\Http\Requests\Treasury\StoreClientRequest;
use App\Http\Requests\Treasury\UpdateClientRequest;
use App\Models\Treasury\Client;
use App\Services\Treasury\ClientService;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    protected $clientService;

    public function __construct(ClientService $clientService)
    {
        $this->clientService = $clientService;
    }

    /**
     * GET /treasury/clients
     * Listar todos los clientes con paginación
     */
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $perPage = $request->query('per_page', 50);

        $clients = $this->clientService->searchClients($search, $perPage);

        return inertia('treasury/clients/index', [
            'clients' => $clients,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * GET /treasury/clients/create
     * Mostrar formulario de creación
     */
    public function create()
    {
        return inertia('treasury/clients/create');  // ← Minúscula
    }

    /**
 * POST /treasury/clients
 * Crear nuevo cliente
 */
public function store(StoreClientRequest $request)
{
    try {
        $client = $this->clientService->createClient($request->validated());

        return redirect()
            ->route('treasury.clients.show', $client->id)  // ← Redirige a show
            ->with('success', 'Cliente creado correctamente');
    } catch (\Exception $e) {
        return redirect()
            ->back()
            ->with('error', $e->getMessage())
            ->withInput();
    }
}

    /**
     * GET /treasury/clients/{client}
     * Ver detalles de un cliente
     */
    public function show(Client $client)
    {
        $balance = $this->clientService->getClientBalance($client);
        
        return inertia('treasury/clients/show', [
            'client' => $client->load(['taxes', 'certificates', 'currentAccountMovements']),
            'balance' => $balance,
        ]);
    }

    /**
     * GET /treasury/clients/{client}/edit
     * Mostrar formulario de edición
     */
    public function edit(Client $client)
    {
        return inertia('treasury/clients/edit', [  // ← Minúscula
            'client' => $client,
        ]);
    }

    /**
     * PUT /treasury/clients/{client}
     * Actualizar cliente
     */
 public function update(UpdateClientRequest $request, Client $client)
{
    try {
        $updated = $this->clientService->updateClient($client, $request->validated());

        return redirect()
            ->route('treasury.clients.show', $updated->id)  // ← Redirige a show
            ->with('success', 'Cliente actualizado correctamente');
    } catch (\Exception $e) {
        return redirect()
            ->back()
            ->with('error', $e->getMessage())
            ->withInput();
    }
}

    /**
     * DELETE /treasury/clients/{client}
     * Eliminar cliente (soft delete)
     */
    public function destroy(Client $client)
    {
        try {
            $this->clientService->deleteClient($client);

            return redirect()
                ->route('treasury.clients.index')
                ->with('success', 'Cliente eliminado correctamente');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * POST /treasury/clients/{client}/restore
     * Restaurar cliente eliminado
     */
    public function restore(Client $client)
    {
        try {
            $restored = $this->clientService->restoreClient($client);

            return redirect()
                ->route('treasury.clients.show', $restored->id)
                ->with('success', 'Cliente restaurado correctamente');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * GET /treasury/clients/{client}/balance
     * Obtener información del saldo (JSON para API)
     */
    public function getBalance(Client $client)
    {
        $balance = $this->clientService->getClientBalance($client);

        return response()->json([
            'success' => true,
            'data' => $balance,
        ]);
    }
}
