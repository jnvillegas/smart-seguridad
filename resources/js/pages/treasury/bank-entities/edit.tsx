import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { BankEntity, BankEntityFormData } from '@/types/treasury';
import { route } from '@/utils/route';  
import { BreadcrumbItem } from '@/types';

interface Props {
  entity: BankEntity;
}

export default function Edit({ entity }: Props) {
  const { data, setData, put, processing, errors } = useForm<BankEntityFormData>({
    nombre: entity.nombre,
    codigo_bcra: entity.codigo_bcra || '',
    cuit: entity.cuit || '',
    telefono: entity.telefono || '',
    email: entity.email || '',
    web: entity.web || '',
    direccion: entity.direccion || '',
    activo: entity.activo,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('treasury.bank-entities.update', entity.id), {
      onSuccess: () => toast.success('Entidad bancaria actualizada correctamente'),
      onError: () => toast.error('Error al actualizar la entidad bancaria'),
    });
  };

     const breadcrumbs: BreadcrumbItem[] = [
                  {
                      title: 'Entidades Bancarias',
                      href: '/treasury/bank-entities',
                  },
              ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar - ${entity.nombre}`} />

      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link href={route('treasury.bank-entities.show', entity.id)}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Editar Entidad Bancaria</h1>
            <p className="text-muted-foreground">{entity.nombre}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Información de la Entidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nombre"
                  value={data.nombre}
                  onChange={(e) => setData('nombre', e.target.value)}
                  placeholder="Ej: Banco Nación"
                  className={errors.nombre ? 'border-destructive' : ''}
                />
                {errors.nombre && (
                  <p className="text-sm text-destructive">{errors.nombre}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="codigo_bcra">Código BCRA</Label>
                  <Input
                    id="codigo_bcra"
                    value={data.codigo_bcra}
                    onChange={(e) => setData('codigo_bcra', e.target.value)}
                    placeholder="Ej: 011"
                    className={errors.codigo_bcra ? 'border-destructive' : ''}
                  />
                  {errors.codigo_bcra && (
                    <p className="text-sm text-destructive">{errors.codigo_bcra}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cuit">CUIT</Label>
                  <Input
                    id="cuit"
                    value={data.cuit}
                    onChange={(e) => setData('cuit', e.target.value)}
                    placeholder="Ej: 30-12345678-9"
                    className={errors.cuit ? 'border-destructive' : ''}
                  />
                  {errors.cuit && (
                    <p className="text-sm text-destructive">{errors.cuit}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={data.telefono}
                    onChange={(e) => setData('telefono', e.target.value)}
                    placeholder="Ej: 0810-123-4567"
                    className={errors.telefono ? 'border-destructive' : ''}
                  />
                  {errors.telefono && (
                    <p className="text-sm text-destructive">{errors.telefono}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="Ej: info@banco.com.ar"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="web">Sitio Web</Label>
                <Input
                  id="web"
                  type="url"
                  value={data.web}
                  onChange={(e) => setData('web', e.target.value)}
                  placeholder="Ej: https://www.banco.com.ar"
                  className={errors.web ? 'border-destructive' : ''}
                />
                {errors.web && (
                  <p className="text-sm text-destructive">{errors.web}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  value={data.direccion}
                  onChange={(e) => setData('direccion', e.target.value)}
                  placeholder="Dirección completa de la casa matriz"
                  rows={3}
                  className={errors.direccion ? 'border-destructive' : ''}
                />
                {errors.direccion && (
                  <p className="text-sm text-destructive">{errors.direccion}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="activo"
                  checked={data.activo}
                  onCheckedChange={(checked) => setData('activo', checked)}
                />
                <Label htmlFor="activo">Entidad activa</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4 mt-6">
            <Link href={route('treasury.bank-entities.show', entity.id)}>
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

