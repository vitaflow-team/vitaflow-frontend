'use client';

import { actionDeletePhoto } from '@/_actions/progressPhotos/deletePhoto';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/_components/ui/alert-dialog';
import { Button } from '@/_components/ui/button';
import { useAlertHook } from '@/_hooks/alertHook';
import { cn } from '@/_lib/utils';
import type { PhotoAngle, ProgressPhoto } from '@/_types/progressPhotos';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';
import { CapturePhotoDialog } from './capturePhotoDialog';

interface PhotoHistoryStripProps {
  angle: PhotoAngle;
  photos: ProgressPhoto[];
}

// Angle-based history (US-003) with same-angle comparison selection
// (US-004): tap up to two photos, then "Comparar" appears. Delete (US-005)
// is a per-photo action, independent of selection.
export function PhotoHistoryStrip({ angle, photos }: PhotoHistoryStripProps) {
  const router = useRouter();
  const { openError } = useAlertHook();
  const { execute: executeDelete } = useServerAction(actionDeletePhoto);
  const [selected, setSelected] = useState<string[]>([]);

  const latest = photos.at(-1);

  function toggleSelect(id: string) {
    setSelected(current => {
      if (current.includes(id)) return current.filter(x => x !== id);
      if (current.length >= 2) return [current[1], id];
      return [...current, id];
    });
  }

  function openComparison() {
    if (selected.length !== 2) return;
    router.push(
      `/restrict/progress?tab=fotos&angle=${angle}&compareA=${selected[0]}&compareB=${selected[1]}`
    );
  }

  async function handleDelete(id: string) {
    const [, error] = await executeDelete({ photoId: id });
    if (error) {
      openError(error.message, 'Não foi possível excluir', 'error');
      return;
    }
    setSelected(current => current.filter(x => x !== id));
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhuma foto para este ângulo ainda. Tire a primeira para começar a
          acompanhar sua evolução visual.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {photos.length < 2
            ? 'Envie uma segunda foto deste ângulo para poder comparar.'
            : 'Toque em duas fotos para compará-las.'}
        </p>
      )}

      <div className="flex gap-3 overflow-x-auto pb-2">
        {photos.map(photo => {
          const isSelected = selected.includes(photo.id);
          return (
            <div key={photo.id} className="relative shrink-0">
              <button
                type="button"
                onClick={() => toggleSelect(photo.id)}
                aria-pressed={isSelected}
                className={cn(
                  'aspect-3/4 w-28 overflow-hidden rounded-lg border-2 transition-colors',
                  isSelected ? 'border-primary' : 'border-transparent'
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.signedUrl}
                  alt={`Foto de ${new Date(photo.takenAt).toLocaleDateString('pt-BR')}`}
                  className="h-full w-full object-cover"
                />
              </button>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                {new Date(photo.takenAt).toLocaleDateString('pt-BR')}
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    aria-label="Excluir foto"
                    className="absolute top-1 right-1 rounded-full bg-background/80 p-1 text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir esta foto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. A foto será removida
                      definitivamente do seu histórico.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(photo.id)}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        })}

        <CapturePhotoDialog
          angle={angle}
          previousPhotoUrl={latest?.signedUrl}
        />
      </div>

      {selected.length === 2 && (
        <Button onClick={openComparison} className="self-start">
          Comparar selecionadas
        </Button>
      )}
    </div>
  );
}
