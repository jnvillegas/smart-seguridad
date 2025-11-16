<?php

namespace App\Http\Controllers\Treasury;

use App\Http\Controllers\Controller;
use App\Models\Treasury\Receipt;
use App\Models\Treasury\Client;
use App\Services\Treasury\ReceiptService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Response;
use App\Services\Treasury\ReceiptPdfService;

class ReceiptController extends Controller
{
    protected ReceiptService $receiptService;

    public function __construct(ReceiptService $receiptService)
    {
        $this->receiptService = $receiptService;
    }

    // Listar recibos
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $receipts = Receipt::with('client')
            ->when($search, fn($q) => $q->search($search))
            ->when($status, fn($q) => $q->byStatus($status))
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('treasury/receipts/index', [
            'receipts' => $receipts,
            'search' => $search,
            'status' => $status,
        ]);
    }

    // Formulario crear
    public function create()
    {
        $clients = Client::orderBy('nombre')->get();

        return Inertia::render('treasury/receipts/create', [
            'clients' => $clients,
        ]);
    }

    // Guardar recibo
    public function store(Request $request)
    {
        try {
            $receipt = $this->receiptService->createReceipt($request->all());

            return redirect()
                ->route('treasury.receipts.show', $receipt->id)
                ->with('success', 'Recibo creado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage())->withInput();
        }
    }

    // Ver detalle de recibo
    public function show(Receipt $receipt)
    {
        $receipt->load('client', 'items');

        return Inertia::render('treasury/receipts/show', [
            'receipt' => $receipt,
        ]);
    }

    // Formulario editar
    public function edit(Receipt $receipt)
    {
        $receipt->load('items');
        $clients = Client::orderBy('nombre')->get();

        return Inertia::render('treasury/receipts/edit', [
            'receipt' => $receipt,
            'clients' => $clients,
        ]);
    }

    // Actualizar recibo
    public function update(Request $request, Receipt $receipt)
    {
        try {
            $updated = $this->receiptService->updateReceipt($receipt, $request->all());

            return redirect()
                ->route('treasury.receipts.show', $updated->id)
                ->with('success', 'Recibo actualizado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage())->withInput();
        }
    }

    // Eliminar recibo
    public function destroy(Receipt $receipt)
    {
        try {
            $this->receiptService->deleteReceipt($receipt);

            return redirect()
                ->route('treasury.receipts.index')
                ->with('success', 'Recibo eliminado correctamente');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function downloadPdf(Receipt $receipt, ReceiptPdfService $pdfService)
{
    try {
        $path = $pdfService->generatePdf($receipt);
        
        return Response::download(
            $path,
            "recibo_{$receipt->numero_recibo}.pdf"
        )->deleteFileAfterSend(true);
    } catch (\Exception $e) {
        return back()->with('error', 'Error al generar PDF: ' . $e->getMessage());
    }
}
}
