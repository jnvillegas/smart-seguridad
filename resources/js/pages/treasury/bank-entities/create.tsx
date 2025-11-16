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
import type { BankEntityFormData } from '@/types/treasury';
import { route } from '@/utils/route'; 
import { BreadcrumbItem } from '@/types';

export default function Create() {
  const { data, setData, post, processing, errors } = useForm<BankEntityFormData>({
    nombre: '',
    codigo_bcra: '',
    cuit: '',
    telefono: '',
    email: '',
    web: '',
    direccion: '',
    activo: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('treasury.bank-entities.store'), {
      onSuccess: () => toast.success('Entidad bancaria creada correctamente'),
      onError: () => toast.error('Error al crear la entidad bancaria'),
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
      <Head title="Nueva Entidad Bancaria" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={route('treasury.bank-entities.index')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Nueva Entidad Bancaria</h1>
            <p className="text-muted-foreground">Registrar una nueva entidad financiera</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Información de la Entidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nombre */}
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

              {/* Grid 2 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Código BCRA */}
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

                {/* CUIT */}
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

                {/* Teléfono */}
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

                {/* Email */}
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

              {/* Web */}
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

              {/* Dirección */}
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

              {/* Estado */}
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 mt-6">
            <Link href={route('treasury.bank-entities.index')}>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={processing}>
              {processing ? 'Guardando...' : 'Guardar Entidad'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
