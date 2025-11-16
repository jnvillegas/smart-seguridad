import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Eye, Edit, Trash2, CreditCard } from 'lucide-react';
import type { BankAccount, BankEntity, PaginatedResponse } from '@/types/treasury';
import { toast } from 'sonner';
import { route } from '@/utils/route';  
import { BreadcrumbItem } from '@/types';

interface Props {
  accounts: PaginatedResponse<BankAccount>;
  bankEntities: BankEntity[];
  filters: {
    search?: string;
    tipo_cuenta?: string;
    moneda?: string;
    activa?: boolean;
    bank_entity_id?: number;
  };
}

export default function Index({ accounts, bankEntities, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [tipoCuenta, setTipoCuenta] = useState(filters.tipo_cuenta || '');
  const [moneda, setMoneda] = useState(filters.moneda || '');
  const [bankEntityId, setBankEntityId] = useState(filters.bank_entity_id?.toString() || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get( route('treasury.bank-accounts.index'),
      { search, tipo_cuenta: tipoCuenta, moneda, bank_entity_id: bankEntityId },
      { preserveState: true }
    );
  };

  const handleDelete = (account: BankAccount) => {
    if (!confirm(`¿Está seguro de eliminar la cuenta "${account.numero_cuenta}"?`)) return;

    router.delete(route('treasury.bank-accounts.destroy', account.id), {
      onSuccess: () => toast.success('Cuenta bancaria eliminada correctamente'),
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
      <Head title="Cuentas Bancarias" />

      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cuentas Bancarias</h1>
            <p className="text-muted-foreground">Gestión de cuentas y saldos bancarios</p>
          </div>
          <Link href={route('treasury.bank-accounts.create')}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cuenta
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por número, CBU o alias..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={tipoCuenta} onValueChange={setTipoCuenta}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="caja_ahorro">Caja de Ahorro</SelectItem>
                    <SelectItem value="cuenta_corriente">Cuenta Corriente</SelectItem>
                    <SelectItem value="cuenta_sueldo">Cuenta Sueldo</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={moneda} onValueChange={setMoneda}>
                  <SelectTrigger>
                    <SelectValue placeholder="Moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="ARS">ARS</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <Select value={bankEntityId} onValueChange={setBankEntityId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Entidad bancaria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las entidades</SelectItem>
                    {bankEntities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button type="submit">Buscar</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Total: {accounts.total} cuenta{accounts.total !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banco</TableHead>
                  <TableHead>Número de Cuenta</TableHead>
                  <TableHead>CBU</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Moneda</TableHead>
                  <TableHead className="text-right">Saldo Actual</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      No hay cuentas bancarias registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  accounts.data.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        {account.bankEntity?.nombre}
                      </TableCell>
                      <TableCell>{account.numero_cuenta}</TableCell>
                      <TableCell className="font-mono text-sm">{account.cbu}</TableCell>
                      <TableCell className="capitalize">
                        {account.tipo_cuenta.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{account.moneda}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(account.saldo_actual, account.moneda)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={account.activa ? 'default' : 'secondary'}>
                          {account.activa ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={route('treasury.bank-accounts.show', account.id)}>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={route('treasury.bank-accounts.edit', account.id)}>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(account)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

