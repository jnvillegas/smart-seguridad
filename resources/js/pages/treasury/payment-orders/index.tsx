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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, FileText, Pencil, Trash2 } from 'lucide-react';
import { PaymentOrder } from '@/types/treasury';
import { PaginatedResponse } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';
import { route } from '@/utils/route';

interface Props {
  paymentOrders: PaginatedResponse<PaymentOrder>;
  filters: {
    search?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  };
}

export default function Index({ paymentOrders, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || 'all');

  const handleSearch = () => {
    router.get(
      route('treasury.payment-orders.index'),
      { search, status: status !== 'all' ? status : undefined },
      { preserveState: true }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta orden de pago?')) {
      router.delete(route('treasury.payment-orders.destroy', id), {
        onSuccess: () => toast.success('Orden de pago eliminada'),
        onError: () => toast.error('Error al eliminar la orden'),
      });
    }
  };

  const getStatusBadge = (paymentOrder: PaymentOrder) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      en_proceso: 'secondary',
      cerrada: 'default',
      anulada: 'destructive',
    };

    return (
      <Badge variant={variants[paymentOrder.status] || 'default'}>
        {paymentOrder.status_label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-AR');
  };

  return (
    <AppLayout>
      <Head title="Órdenes de Pago" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Órdenes de Pago</h1>
            <p className="text-muted-foreground">
              Gestión de pagos a proveedores
            </p>
          </div>
          <Link href="/treasury/payment-orders/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Orden de Pago
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, destinatario, concepto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-9"
              />
            </div>
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="en_proceso">En Proceso</SelectItem>
              <SelectItem value="cerrada">Cerrada</SelectItem>
              <SelectItem value="anulada">Anulada</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSearch}>Buscar</Button>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Destinatario</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto Pagado</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentOrders.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No hay órdenes de pago registradas
                  </TableCell>
                </TableRow>
              ) : (
                paymentOrders.data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{formatDate(order.date)}</TableCell>
                    <TableCell className="font-mono">{order.number}</TableCell>
                    <TableCell>
                      {order.supplier?.nombre} {order.supplier?.apellido}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {order.concept}
                    </TableCell>
                    <TableCell>{getStatusBadge(order)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.amount_paid)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(order.balance)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link href={`/treasury/payment-orders/${order.id}`}>

                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                        {order.status === 'en_proceso' && (
                          <>
                            <Link href={`/treasury/payment-orders/${order.id}/edit`}>


                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(order.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {paymentOrders.data.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {paymentOrders.from} a {paymentOrders.to} de{' '}
              {paymentOrders.total} resultados
            </p>
            <div className="flex gap-2">
              {paymentOrders.links.map((link, index) => (
                <Button
                  key={index}
                  variant={link.active ? 'default' : 'outline'}
                  size="sm"
                  disabled={!link.url}
                  onClick={() => link.url && router.visit(link.url)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
