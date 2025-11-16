import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { BankAccount, BankAccountFormData, BankEntity } from '@/types/treasury';
import { route } from '@/utils/route'; 
import { BreadcrumbItem } from '@/types';

interface Props {
  account: BankAccount;
  bankEntities: BankEntity[];
}

export default function Edit({ account, bankEntities }: Props) {
  const { data, setData, put, processing, errors } = useForm<BankAccountFormData>({
    bank_entity_id: account.bank_entity_id,
    numero_cuenta: account.numero_cuenta,
    cbu: account.cbu,
    alias: account.alias || '',
    tipo_cuenta: account.tipo_cuenta,
    moneda: account.moneda,
    saldo_inicial: account.saldo_inicial,
    fecha_apertura: account.fecha_apertura || '',
    activa: account.activa,
    observaciones: account.observaciones || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('treasury.bank-accounts.update', account.id), {
      onSuccess: () => toast.success('Cuenta bancaria actualizada correctamente'),
      onError: () => toast.error('Error al actualizar la cuenta bancaria'),
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
                  {
                      title: 'Cuentas Bancarias',
                      href: '/treasury/bank-accounts',
                  },
              ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar - ${account.numero_cuenta}`} />

      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href={route('treasury.bank-accounts.show', account.id)}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Editar Cuenta Bancaria</h1>
            <p className="text-muted-foreground">{account.numero_cuenta}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Información de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bank_entity_id">
                  Entidad Bancaria <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={data.bank_entity_id.toString()}
                  onValueChange={(value) => setData('bank_entity_id', parseInt(value))}
                >
                  <SelectTrigger className={errors.bank_entity_id ? 'border-destructive' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bankEntities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bank_entity_id && (
                  <p className="text-sm text-destructive">{errors.bank_entity_id}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="numero_cuenta">
                    Número de Cuenta <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="numero_cuenta"
                    value={data.numero_cuenta}
                    onChange={(e) => setData('numero_cuenta', e.target.value)}
                    className={errors.numero_cuenta ? 'border-destructive' : ''}
                  />
                  {errors.numero_cuenta && (
                    <p className="text-sm text-destructive">{errors.numero_cuenta}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cbu">
                    CBU <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cbu"
                    value={data.cbu}
                    onChange={(e) => setData('cbu', e.target.value)}
                    maxLength={22}
                    className={errors.cbu ? 'border-destructive' : ''}
                  />
                  {errors.cbu && (
                    <p className="text-sm text-destructive">{errors.cbu}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alias">Alias</Label>
                  <Input
                    id="alias"
                    value={data.alias}
                    onChange={(e) => setData('alias', e.target.value)}
                    className={errors.alias ? 'border-destructive' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_cuenta">
                    Tipo de Cuenta <span className="text-destructive">*</span>
                  </Label>
                  <Select value={data.tipo_cuenta} onValueChange={(value: any) => setData('tipo_cuenta', value)}>
                    <SelectTrigger className={errors.tipo_cuenta ? 'border-destructive' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caja_ahorro">Caja de Ahorro</SelectItem>
                      <SelectItem value="cuenta_corriente">Cuenta Corriente</SelectItem>
                      <SelectItem value="cuenta_sueldo">Cuenta Sueldo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moneda">
                    Moneda <span className="text-destructive">*</span>
                  </Label>
                  <Select value={data.moneda} onValueChange={(value: any) => setData('moneda', value)}>
                    <SelectTrigger className={errors.moneda ? 'border-destructive' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                      <SelectItem value="USD">USD - Dólar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="saldo_inicial">
                    Saldo Inicial <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="saldo_inicial"
                    type="number"
                    step="0.01"
                    value={data.saldo_inicial}
                    onChange={(e) => setData('saldo_inicial', e.target.value)}
                    className={errors.saldo_inicial ? 'border-destructive' : ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_apertura">Fecha de Apertura</Label>
                  <Input
                    id="fecha_apertura"
                    type="date"
                    value={data.fecha_apertura}
                    onChange={(e) => setData('fecha_apertura', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={data.observaciones}
                  onChange={(e) => setData('observaciones', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="activa"
                  checked={data.activa}
                  onCheckedChange={(checked) => setData('activa', checked)}
                />
                <Label htmlFor="activa">Cuenta activa</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4 mt-6">
            <Link href={route('treasury.bank-accounts.show', account.id)}>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              {processing ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

