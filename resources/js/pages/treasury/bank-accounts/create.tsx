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
import type { BankAccountFormData, BankEntity } from '@/types/treasury';
import { route } from '@/utils/route';  
import { BreadcrumbItem } from '@/types';

interface Props {
  bankEntities: BankEntity[];
}

export default function Create({ bankEntities }: Props) {
  const { data, setData, post, processing, errors } = useForm<BankAccountFormData>({
    bank_entity_id: 0,
    numero_cuenta: '',
    cbu: '',
    alias: '',
    tipo_cuenta: 'caja_ahorro',
    moneda: 'ARS',
    saldo_inicial: '0.00',
    fecha_apertura: '',
    activa: true,
    observaciones: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('treasury.bank-accounts.store'), {
      onSuccess: () => toast.success('Cuenta bancaria creada correctamente'),
      onError: () => toast.error('Error al crear la cuenta bancaria'),
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
      <Head title="Nueva Cuenta Bancaria" />

      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href={route('treasury.bank-accounts.index')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Nueva Cuenta Bancaria</h1>
            <p className="text-muted-foreground">Registrar una nueva cuenta bancaria</p>
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
                    <SelectValue placeholder="Seleccione una entidad bancaria" />
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
                    placeholder="Ej: 1234567890"
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
                    placeholder="22 dígitos"
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
                    placeholder="Ej: empresa.cuenta"
                    className={errors.alias ? 'border-destructive' : ''}
                  />
                  {errors.alias && (
                    <p className="text-sm text-destructive">{errors.alias}</p>
                  )}
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
                  {errors.tipo_cuenta && (
                    <p className="text-sm text-destructive">{errors.tipo_cuenta}</p>
                  )}
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
                  {errors.moneda && (
                    <p className="text-sm text-destructive">{errors.moneda}</p>
                  )}
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
                    placeholder="0.00"
                    className={errors.saldo_inicial ? 'border-destructive' : ''}
                  />
                  {errors.saldo_inicial && (
                    <p className="text-sm text-destructive">{errors.saldo_inicial}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_apertura">Fecha de Apertura</Label>
                  <Input
                    id="fecha_apertura"
                    type="date"
                    value={data.fecha_apertura}
                    onChange={(e) => setData('fecha_apertura', e.target.value)}
                    className={errors.fecha_apertura ? 'border-destructive' : ''}
                  />
                  {errors.fecha_apertura && (
                    <p className="text-sm text-destructive">{errors.fecha_apertura}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={data.observaciones}
                  onChange={(e) => setData('observaciones', e.target.value)}
                  placeholder="Observaciones adicionales"
                  rows={3}
                  className={errors.observaciones ? 'border-destructive' : ''}
                />
                {errors.observaciones && (
                  <p className="text-sm text-destructive">{errors.observaciones}</p>
                )}
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
            <Link href={route('treasury.bank-accounts.index')}>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              {processing ? 'Guardando...' : 'Guardar Cuenta'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

