<?php

namespace App\Services\Treasury;

use App\Models\Treasury\Receipt;
use TCPDF;

class ReceiptPdfService
{
    public function generatePdf(Receipt $receipt): string
    {
        $receipt->load('client', 'items');

        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        
        // Configuración
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        $pdf->SetMargins(15, 15, 15);
        $pdf->SetAutoPageBreak(TRUE, 15);
        
        // Página
        $pdf->AddPage();
        $pdf->SetFont('helvetica', 'B', 20);
        $pdf->Cell(0, 10, 'RECIBO', 0, 1, 'C');
        
        $pdf->SetFont('helvetica', '', 10);
        $pdf->Ln(5);
        
        // Información del recibo
        $pdf->SetFont('helvetica', 'B', 10);
        $pdf->Cell(50, 7, 'Número:', 0, 0);
        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(0, 7, $receipt->numero_recibo, 0, 1);
        
        $pdf->SetFont('helvetica', 'B', 10);
        $pdf->Cell(50, 7, 'Fecha:', 0, 0);
        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(0, 7, $receipt->fecha_recibo, 0, 1);
        
        // Cliente
        $pdf->SetFont('helvetica', 'B', 10);
        $pdf->Cell(50, 7, 'Cliente:', 0, 0);
        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(0, 7, $receipt->client->nombre . ' ' . $receipt->client->apellido, 0, 1);
        
        $pdf->SetFont('helvetica', 'B', 10);
        $pdf->Cell(50, 7, 'Documento:', 0, 0);
        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(0, 7, $receipt->client->documento, 0, 1);
        
        $pdf->Ln(5);
        
        // Tabla de items
        $pdf->SetFont('helvetica', 'B', 9);
        $pdf->SetFillColor(200, 200, 200);
        $pdf->Cell(80, 7, 'Descripción', 1, 0, 'L', true);
        $pdf->Cell(25, 7, 'Cantidad', 1, 0, 'C', true);
        $pdf->Cell(35, 7, 'Precio Unit.', 1, 0, 'R', true);
        $pdf->Cell(35, 7, 'Subtotal', 1, 1, 'R', true);
        
        $pdf->SetFont('helvetica', '', 9);
        $pdf->SetFillColor(255, 255, 255);
        
        foreach ($receipt->items as $item) {
            $pdf->Cell(80, 7, $item->descripcion, 1, 0, 'L');
            $pdf->Cell(25, 7, $item->cantidad, 1, 0, 'C');
            $pdf->Cell(35, 7, '$' . number_format($item->precio_unitario, 2, ',', '.'), 1, 0, 'R');
            $pdf->Cell(35, 7, '$' . number_format($item->subtotal, 2, ',', '.'), 1, 1, 'R');
        }
        
        // Totales
        $pdf->Ln(3);
        $pdf->SetFont('helvetica', 'B', 10);
        
        $pdf->SetDrawColor(0, 0, 0);
        $pdf->SetLineWidth(0.3);
        $pdf->Line(15, $pdf->GetY(), 200, $pdf->GetY());
        
        $pdf->Cell(140, 7, 'Subtotal:', 0, 0, 'R');
        $pdf->Cell(35, 7, '$' . number_format($receipt->subtotal, 2, ',', '.'), 0, 1, 'R');
        
        $pdf->Cell(140, 7, 'Impuesto:', 0, 0, 'R');
        $pdf->Cell(35, 7, '$' . number_format($receipt->impuesto, 2, ',', '.'), 0, 1, 'R');
        
        $pdf->SetFont('helvetica', 'B', 12);
        $pdf->SetFillColor(240, 240, 240);
        $pdf->Cell(140, 8, 'TOTAL:', 0, 0, 'R', true);
        $pdf->Cell(35, 8, '$' . number_format($receipt->total, 2, ',', '.'), 0, 1, 'R', true);
        
        // Información adicional
        $pdf->Ln(5);
        $pdf->SetFont('helvetica', 'B', 9);
        $pdf->Cell(50, 5, 'Método de Pago:', 0, 0);
        $pdf->SetFont('helvetica', '', 9);
        $pdf->Cell(0, 5, ucfirst($receipt->metodo_pago), 0, 1);
        
        if ($receipt->referencia) {
            $pdf->SetFont('helvetica', 'B', 9);
            $pdf->Cell(50, 5, 'Referencia:', 0, 0);
            $pdf->SetFont('helvetica', '', 9);
            $pdf->Cell(0, 5, $receipt->referencia, 0, 1);
        }
        
        if ($receipt->observaciones) {
            $pdf->SetFont('helvetica', 'B', 9);
            $pdf->Cell(0, 5, 'Observaciones:', 0, 1);
            $pdf->SetFont('helvetica', '', 9);
            $pdf->MultiCell(0, 5, $receipt->observaciones, 0, 'L');
        }
        
        // Guardar PDF temporalmente
        $filename = "recibo_{$receipt->numero_recibo}_{$receipt->id}.pdf";
        $path = storage_path("app/receipts/{$filename}");
        
        if (!file_exists(storage_path("app/receipts"))) {
            mkdir(storage_path("app/receipts"), 0755, true);
        }
        
        $pdf->Output($path, 'F');
        
        return $path;
    }
}
