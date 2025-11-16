import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Eye, Edit } from 'lucide-react';
import { useState } from 'react';
import type { Receipt } from '@/types/treasury';
import { BreadcrumbItem } from '@/types';

interface Props {
  receipts: {
    data: Receipt[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  search?: string;
  status?: string;
}

 const breadcrumbs: BreadcrumbItem[] = [
            {
                title: 'Recibos',
                href: '/treasury/receipts',
            },
        ];

export default function ReceiptsIndex({ receipts, search, status }: Props) {
  const [searchTerm, setSearchTerm] = useState(search || '');

  const handleSearch = () => {
    router.get('/treasury/receipts', { search: searchTerm }, { preserveState: true });
  };

  const getStatusBadge = (estado: string) => {
    const styles = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      pagado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    
    const labels = {
      pendiente: 'Pendiente',
      pagado: 'Pagado',
      cancelado: 'Cancelado',
    };
    
    return (
      <Badge className={styles[estado as keyof typeof styles]}>
        {labels[estado as keyof typeof labels]}
      </Badge>
    );
  };

  const getPaymentMethod = (method: string) => {
    const methods = {
      efectivo: 'Efectivo',
      cheque: 'Cheque',
      transferencia: 'Transferencia',
      tarjeta: 'Tarjeta',
      otro: 'Otro',
    };
    return methods[method as keyof typeof methods] || method;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Recibos" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recibos</h1>
            <p className="text-muted-foreground mt-2">
              Gestiona los recibos de pago
            </p>
          </div>
          <Link href="/treasury/receipts/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Recibo
            </Button>
          </Link>
        </div>

        {/* Búsqueda */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número de recibo o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Buscar</Button>
        </div>

        {/* Tabla */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Método Pago</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No hay recibos registrados
                  </TableCell>
                </TableRow>
              ) : (
                receipts.data.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">
                      {receipt.numero_recibo}
                    </TableCell>
                    <TableCell>
                      {receipt.client?.nombre} {receipt.client?.apellido}
                    </TableCell>
                    <TableCell>
                      {new Date(receipt.fecha_recibo).toLocaleDateString('es-AR')}
                    </TableCell>
                    <TableCell>{getStatusBadge(receipt.estado)}</TableCell>
                    <TableCell>{getPaymentMethod(receipt.metodo_pago)}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${parseFloat(receipt.total).toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Link href={`/treasury/receipts/${receipt.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/treasury/receipts/${receipt.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {receipts.last_page > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {receipts.data.length} de {receipts.total} recibos
            </p>
            <div className="flex gap-2">
              {receipts.current_page > 1 && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.get(`/treasury/receipts?page=${receipts.current_page - 1}`)
                  }
                >
                  Anterior
                </Button>
              )}
              {receipts.current_page < receipts.last_page && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.get(`/treasury/receipts?page=${receipts.current_page + 1}`)
                  }
                >
                  Siguiente
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
