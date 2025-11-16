import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { ClientTax, Tax } from '@/types/treasury';

interface TaxFormProps {
  clientId: number;
  tax?: ClientTax;
  taxes: Tax[];
  open: boolean;
  onClose: () => void;
}

export default function TaxForm({ clientId, tax, taxes, open, onClose }: TaxFormProps) {
  const isEditing = !!tax;

  const { data, setData, post, put, processing, errors, reset } = useForm({
    tax_id: tax?.tax_id || '',
    fecha_actualizacion: tax?.fecha_actualizacion || new Date().toISOString().split('T')[0],
    alcuota: tax?.alcuota || '',
    observaciones: tax?.observaciones || '',
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const url = isEditing
      ? route('treasury.clients.taxes.update', [clientId, tax.id])
      : route('treasury.clients.taxes.store', clientId);

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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Impuesto' : 'Agregar Impuesto'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica los datos del impuesto asociado al cliente.'
              : 'Completa los datos para asociar un nuevo impuesto al cliente.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Impuesto */}
            <div className="space-y-2">
              <Label htmlFor="tax_id">
                Impuesto <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.tax_id.toString()}
                onValueChange={(value) => setData('tax_id', parseInt(value))}
                disabled={isEditing}
              >
                <SelectTrigger className={errors.tax_id ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Seleccionar impuesto" />
                </SelectTrigger>
                <SelectContent>
                  {taxes.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.nombre} ({t.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tax_id && (
                <p className="text-sm text-destructive">{errors.tax_id}</p>
              )}
            </div>

            {/* Fecha de Actualización */}
            <div className="space-y-2">
              <Label htmlFor="fecha_actualizacion">
                Fecha de Actualización <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fecha_actualizacion"
                type="date"
                value={data.fecha_actualizacion}
                onChange={(e) => setData('fecha_actualizacion', e.target.value)}
                className={errors.fecha_actualizacion ? 'border-destructive' : ''}
              />
              {errors.fecha_actualizacion && (
                <p className="text-sm text-destructive">{errors.fecha_actualizacion}</p>
              )}
            </div>

            {/* Alícuota */}
            <div className="space-y-2">
              <Label htmlFor="alcuota">
                Alícuota (%) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="alcuota"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0.00"
                value={data.alcuota}
                onChange={(e) => setData('alcuota', e.target.value)}
                className={errors.alcuota ? 'border-destructive' : ''}
              />
              {errors.alcuota && (
                <p className="text-sm text-destructive">{errors.alcuota}</p>
              )}
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                rows={3}
                placeholder="Observaciones adicionales..."
                value={data.observaciones}
                onChange={(e) => setData('observaciones', e.target.value)}
                className={errors.observaciones ? 'border-destructive' : ''}
              />
              {errors.observaciones && (
                <p className="text-sm text-destructive">{errors.observaciones}</p>
              )}
            </div>
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
