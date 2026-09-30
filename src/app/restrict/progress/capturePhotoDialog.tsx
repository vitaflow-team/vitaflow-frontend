'use client';

import { actionUploadPhoto } from '@/_actions/progressPhotos/uploadPhoto';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { useAlertHook } from '@/_hooks/alertHook';
import type { PhotoAngle } from '@/_types/progressPhotos';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useServerAction } from 'zsa-react';
import { CameraOverlayCapture } from './cameraOverlayCapture';

interface CapturePhotoDialogProps {
  angle: PhotoAngle;
  previousPhotoUrl?: string;
}

// The "add photo" tile from the validated prototype's history strip — opens
// the capture flow (US-002), confirms a preview, then uploads.
export function CapturePhotoDialog({
  angle,
  previousPhotoUrl,
}: CapturePhotoDialogProps) {
  const router = useRouter();
  const { openError } = useAlertHook();
  const { isPending, execute } = useServerAction(actionUploadPhoto);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function handleCapture(captured: File) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = URL.createObjectURL(captured);
    setFile(captured);
  }

  function retake() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setFile(null);
  }

  async function confirm() {
    if (!file) return;
    const [, error] = await execute({ angle, file });
    if (error) {
      openError(error.message, 'Não foi possível enviar', 'error');
      return;
    }
    retake();
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={next => {
        if (!next) retake();
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Adicionar foto"
          className="flex aspect-3/4 w-28 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          <Plus className="size-6" />
          <span className="text-xs">Adicionar</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova foto de progresso</DialogTitle>
        </DialogHeader>

        {file && previewUrlRef.current ? (
          <div className="flex flex-col items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrlRef.current}
              alt="Prévia da foto capturada"
              className="aspect-3/4 w-full max-w-sm rounded-lg object-cover"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={retake} disabled={isPending}>
                Tirar outra
              </Button>
              <Button onClick={confirm} disabled={isPending}>
                {isPending ? 'Enviando...' : 'Confirmar e enviar'}
              </Button>
            </div>
          </div>
        ) : (
          <CameraOverlayCapture
            previousPhotoUrl={previousPhotoUrl}
            onCapture={handleCapture}
          />
        )}

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
