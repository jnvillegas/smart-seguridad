import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import type { CashWithdrawal } from '@/types/treasury';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  withdrawal: CashWithdrawal;
}

export default function ShowCashWithdrawal({ withdrawal }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    if (!confirm('¿Seguro que deseas eliminar este egreso de caja?')) return;

    setDeleting(true);
    router.delete(`/treasury/cash-withdrawals/${withdrawal.id}`, {
      onSuccess: () => toast.success('Egreso de caja eliminado correctamente'),
      onError: () => toast.error('Error al eliminar el egreso de caja'),
      onFinish: () => setDeleting(false),
    });
  };

  const total = Number(withdrawal.total || 0);

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
      <Head title={`Egreso ${withdrawal.number}`} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/treasury/cash-withdrawals">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Egreso {withdrawal.number}
              </h1>
              <p className="text-muted-foreground">
                {new Date(withdrawal.date).toLocaleDateString('es-AR')} ·{' '}
                {getStatusLabel(withdrawal.status)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/treasury/cash-withdrawals/${withdrawal.id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>

        {/* Datos principales */}
        <Card>
          <CardHeader>
            <CardTitle>Datos Principales</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Destinatario</p>
              <p className="font-medium">{withdrawal.recipient}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Motivo</p>
              <p className="font-medium">{withdrawal.reason}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Caja Sucursal</p>
              <p className="font-medium">
                {withdrawal.cash_register?.name || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Centro de Costos</p>
              <p className="font-medium">
                {withdrawal.cost_center
                  ? `${withdrawal.cost_center.code} - ${withdrawal.cost_center.name}`
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moneda</p>
              <p className="font-medium">{withdrawal.currency}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Usuario</p>
              <p className="font-medium">{withdrawal.user?.name}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Detalle</p>
              <p className="font-medium whitespace-pre-line">{withdrawal.detail}</p>
            </div>
          </CardContent>
        </Card>

        {/* Conceptos */}
        <Card>
          <CardHeader>
            <CardTitle>Conceptos Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Observación</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawal.items && withdrawal.items.length > 0 ? (
                    withdrawal.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.observation}</TableCell>
                        <TableCell>{item.concept}</TableCell>
                        <TableCell className="text-right">
                          ${Number(item.amount).toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-4 text-muted-foreground"
                      >
                        No hay conceptos cargados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end text-xl font-bold">
              Total:{' '}
              ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
