import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Building2, CreditCard, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import type { BankAccount } from '@/types/treasury';
import { route } from '@/utils/route'; 
import { BreadcrumbItem } from '@/types';

interface Props {
  account: BankAccount;
}

export default function Show({ account }: Props) {
  const handleDelete = () => {
    if (!confirm(`¿Está seguro de eliminar la cuenta "${account.numero_cuenta}"?`)) return;

    router.delete(route('treasury.bank-accounts.destroy', account.id), {
      onSuccess: () => {
        toast.success('Cuenta bancaria eliminada correctamente');
        router.visit(route('treasury.bank-accounts.index'));
      },
      onError: () => toast.error('Error al eliminar la cuenta bancaria'),
    });
  };

  const formatCurrency = (amount: string, currency: string) => {
    const value = parseFloat(amount);
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency === 'ARS' ? 'ARS' : currency,
    }).format(value);
  };

   const breadcrumbs: BreadcrumbItem[] = [
                {
                    title: 'Cuentas Bancarias',
                    href: '/treasury/bank-accounts',
                },
            ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Cuenta - ${account.numero_cuenta}`} />

      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={route('treasury.bank-accounts.index')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{account.numero_cuenta}</h1>
              <p className="text-muted-foreground">{account.bankEntity?.nombre}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={route('treasury.bank-accounts.edit', account.id)}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Inicial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(account.saldo_inicial, account.moneda)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(account.saldo_actual, account.moneda)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={account.activa ? 'default' : 'secondary'} className="text-base">
                {account.activa ? 'Activa' : 'Inactiva'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Información de la Entidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Entidad Bancaria</p>
                <p className="text-base font-medium">{account.bankEntity?.nombre}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Código BCRA</p>
                <p className="text-base font-medium">{account.bankEntity?.codigo_bcra || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Datos de la Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Número de Cuenta</p>
                <p className="text-base font-medium">{account.numero_cuenta}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">CBU</p>
                <p className="text-base font-medium font-mono">{account.cbu}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Alias</p>
                <p className="text-base font-medium">{account.alias || '-'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Tipo de Cuenta</p>
                <p className="text-base font-medium capitalize">
                  {account.tipo_cuenta.replace('_', ' ')}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Moneda</p>
                <Badge variant="outline">{account.moneda}</Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Fecha de Apertura</p>
                <p className="text-base font-medium">
                  {account.fecha_apertura
                    ? new Date(account.fecha_apertura).toLocaleDateString('es-AR')
                    : '-'}
                </p>
              </div>
            </div>

            {account.observaciones && (
              <div>
                <p className="text-sm text-muted-foreground">Observaciones</p>
                <p className="text-base">{account.observaciones}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

