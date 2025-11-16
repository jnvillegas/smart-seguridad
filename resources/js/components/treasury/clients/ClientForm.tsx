import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClientFormProps {
  client?: any;
  onSubmit: (data: any) => void;
}

export default function ClientForm({ client, onSubmit }: ClientFormProps) {
  const form = useForm({
    defaultValues: {
      nombre: client?.nombre || '',
      apellido: client?.apellido || '',
      documento: client?.documento || '',
      tipo_documento: client?.tipo_documento || 'CUIT',
      tipo_persona: client?.tipo_persona || 'fisica',
      categoria_fiscal: client?.categoria_fiscal || 'responsable_inscripto',
      domicilio: client?.domicilio || '',
      localidad: client?.localidad || '',
      email: client?.email || '',
    },
  });

  const handleCancel = () => {
    window.location.href = '/treasury/clients';
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre *</label>
              <Input placeholder="Juan" {...form.register('nombre')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apellido *</label>
              <Input placeholder="Pérez" {...form.register('apellido')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Documento *</label>
              <Input placeholder="20-12345678-9" {...form.register('documento')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo Documento *</label>
              <select
                {...form.register('tipo_documento')}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="CUIT">CUIT</option>
                <option value="DNI">DNI</option>
                <option value="CUIL">CUIL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo Persona *</label>
              <select
                {...form.register('tipo_persona')}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="fisica">Persona Física</option>
                <option value="juridica">Persona Jurídica</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Fiscal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Categoría Fiscal *</label>
              <select
                {...form.register('categoria_fiscal')}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="responsable_inscripto">Responsable Inscripto</option>
                <option value="monotributo">Monotributo</option>
                <option value="consumidor_final">Consumidor Final</option>
                <option value="exento">Exento</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domicilio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Domicilio *</label>
              <Input placeholder="Av. Siempre Viva 123" {...form.register('domicilio')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Localidad *</label>
              <Input placeholder="Buenos Aires" {...form.register('localidad')} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" placeholder="cliente@ejemplo.com" {...form.register('email')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit">Guardar Cliente</Button>
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

