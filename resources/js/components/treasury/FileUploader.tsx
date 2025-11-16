import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  clientId: number;
  open: boolean;
  onClose: () => void;
}

export default function FileUploader({ clientId, open, onClose }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, setData, post, processing, errors, reset, progress } = useForm<{
    archivo: File | null;
    nombre: string;
  }>({
    archivo: null,
    nombre: '',
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo no debe superar los 10MB');
      return;
    }

    // Validar tipo
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de archivo no permitido. Solo PDF, DOC, XLS, JPG, PNG');
      return;
    }

    setData('archivo', file);
    setData('nombre', file.name);

    // Preview para imágenes
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemoveFile = () => {
    setData('archivo', null);
    setData('nombre', '');
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    if (!data.archivo) {
      return;
    }

    post(route('treasury.clients.attachments.store', clientId), {
      onSuccess: () => {
        reset();
        setPreview(null);
        onClose();
      },
      forceFormData: true,
    });
  };

  const handleClose = () => {
    reset();
    setPreview(null);
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Subir Archivo</DialogTitle>
          <DialogDescription>
            Sube un archivo adjunto para este cliente. Tamaño máximo: 10MB
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Dropzone */}
            {!data.archivo ? (
              <div
                className={cn(
                  'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />

                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      Arrastra un archivo aquí o{' '}
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="text-primary hover:underline"
                      >
                        explora
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, XLS, JPG, PNG (máx. 10MB)
                    </p>
                  </div>
                </div>

                {errors.archivo && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.archivo}</span>
                  </div>
                )}
              </div>
            ) : (
              /* Preview del archivo */
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <File className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{data.archivo.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(data.archivo.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    disabled={processing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress bar */}
                {processing && progress && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subiendo...</span>
                      <span>{progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nombre del archivo */}
            {data.archivo && (
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del archivo</Label>
                <Input
                  id="nombre"
                  value={data.nombre}
                  onChange={(e) => setData('nombre', e.target.value)}
                  placeholder="Nombre descriptivo del archivo"
                  disabled={processing}
                  className={errors.nombre ? 'border-destructive' : ''}
                />
                {errors.nombre && (
                  <p className="text-sm text-destructive">{errors.nombre}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!data.archivo || processing}>
              {processing ? `Subiendo... ${progress?.percentage || 0}%` : 'Subir Archivo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
