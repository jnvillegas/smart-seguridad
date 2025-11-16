import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientCertificate } from '@/types/treasury';
import { AlertCircle } from 'lucide-react';

interface CertificateFormProps {
  clientId: number;
  certificate?: ClientCertificate;
  open: boolean;
  onClose: () => void;
}

export default function CertificateForm({
  clientId,
  certificate,
  open,
  onClose,
}: CertificateFormProps) {
  const isEditing = !!certificate;

  const { data, setData, post, put, processing, errors, reset } = useForm({
    tipo_certificado: certificate?.tipo_certificado || 'IVA',
    numero: certificate?.numero || '',
    fecha_vencimiento: certificate?.fecha_vencimiento || '',
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const url = isEditing
      ? route('treasury.clients.certificates.update', [clientId, certificate.id])
      : route('treasury.clients.certificates.store', clientId);

    const method = isEditing ? put : post;

    method(url, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Calcular fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Certificado' : 'Agregar Certificado'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica los datos del certificado de no retención.'
              : 'Completa los datos para agregar un certificado de no retención.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Tipo de Certificado */}
            <div className="space-y-2">
              <Label htmlFor="tipo_certificado">
                Tipo de Certificado <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.tipo_certificado}
                onValueChange={(value) => setData('tipo_certificado', value)}
                disabled={isEditing}
              >
                <SelectTrigger className={errors.tipo_certificado ? 'border-destructive' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IVA">IVA</SelectItem>
                  <SelectItem value="IIBB">IIBB</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_certificado && (
                <p className="text-sm text-destructive">{errors.tipo_certificado}</p>
              )}
            </div>

            {/* Número */}
            <div className="space-y-2">
              <Label htmlFor="numero">
                Número de Certificado <span className="text-destructive">*</span>
              </Label>
              <Input
                id="numero"
                placeholder="Ej: 123456789"
                value={data.numero}
                onChange={(e) => setData('numero', e.target.value)}
                className={errors.numero ? 'border-destructive' : ''}
              />
              {errors.numero && <p className="text-sm text-destructive">{errors.numero}</p>}
            </div>

            {/* Fecha de Vencimiento */}
            <div className="space-y-2">
              <Label htmlFor="fecha_vencimiento">
                Fecha de Vencimiento <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fecha_vencimiento"
                type="date"
                min={today}
                value={data.fecha_vencimiento}
                onChange={(e) => setData('fecha_vencimiento', e.target.value)}
                className={errors.fecha_vencimiento ? 'border-destructive' : ''}
              />
              {errors.fecha_vencimiento && (
                <p className="text-sm text-destructive">{errors.fecha_vencimiento}</p>
              )}
            </div>

            {/* Alerta de vencimiento */}
            {data.fecha_vencimiento && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-900">Recordatorio</p>
                  <p className="text-yellow-700">
                    Recibirás una notificación 48 horas antes del vencimiento.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
              Cancelar
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Guardando...' : isEditing ? 'Actualizar' : 'Agregar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
