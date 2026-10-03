'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/_components/ui/alert-dialog';
import {
  DECLARATION_PARAGRAPHS,
  DECLARATION_TITLE,
} from '@/_constants/declarationText';

interface DeclarationDialogProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * The one-time health-data declaration. Closing it any way other than
 * accepting counts as declining: nothing is saved and the form stays as typed.
 */
export function DeclarationDialog({
  open,
  onAccept,
  onDecline,
}: DeclarationDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={next => {
        if (!next) onDecline();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{DECLARATION_TITLE}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col gap-2 text-left">
              {DECLARATION_PARAGRAPHS.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onAccept}>Li e aceito</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
