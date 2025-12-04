import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { CashWithdrawal } from '@/types/treasury';

interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Props {
  withdrawals: Paginated<CashWithdrawal>;
  filters: {
    search?: string;
    status?: string;
  };
}

export default function CashWithdrawalsIndex({ withdrawals, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = () => {
    router.get('/treasury/cash-withdrawals', { search: searchTerm }, { preserveState: true });
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      en_proceso: 'En proceso',
      cerrado: 'Cerrado',
      anulado: 'Anulado',
    };
    return map[status] || status;
  };

  return (
    <AppLayout>
      <Head title="Egresos de Caja" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Egresos de Caja</h1>
            <p className="text-muted-foreground mt-2">
              Registrar y consultar egresos de la caja tesorería
            </p>
          </div>
          <Link href="/treasury/cash-withdrawals/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Egreso
            </Button>
          </Link>
        </div>

        {/* Búsqueda */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, destinatario o concepto..."
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
                <TableHead>Fecha</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Destinatario</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Detalle</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No hay egresos registrados
                  </TableCell>
                </TableRow>
              ) : (
                withdrawals.data.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell>
                      {new Date(w.date).toLocaleDateString('es-AR')}
                    </TableCell>
                    <TableCell className="font-medium">{w.number}</TableCell>
                    <TableCell>{w.recipient}</TableCell>
                    <TableCell>{w.reason}</TableCell>
                    <TableCell className="max-w-xs truncate">{w.detail}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${Number(w.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusLabel(w.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/treasury/cash-withdrawals/${w.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/treasury/cash-withdrawals/${w.id}/edit`}>
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
        {withdrawals.last_page > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {withdrawals.data.length} de {withdrawals.total} egresos
            </p>
            <div className="flex gap-2">
              {withdrawals.current_page > 1 && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.get(`/treasury/cash-withdrawals?page=${withdrawals.current_page - 1}`)
                  }
                >
                  Anterior
                </Button>
              )}
              {withdrawals.current_page < withdrawals.last_page && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.get(`/treasury/cash-withdrawals?page=${withdrawals.current_page + 1}`)
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
