'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { decideClose } from '@/_lib/assessmentFormValues';
import type { Assessment } from '@/_types/students';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { AssessmentForm } from './assessmentForm';
import { DiscardChangesDialog } from './discardChangesDialog';

interface AssessmentFormDialogProps {
  studentId: string;
  trigger: ReactNode;
  title: string;
  existing?: Assessment;
  previous?: Assessment | null;
  declarationAccepted: boolean;
  defaultOpen?: boolean;
}

/**
 * Hosts the form. Closing it with typed values asks first; nothing typed
 * closes at once. Saving closes it without asking.
 */
export function AssessmentFormDialog({
  trigger,
  title,
  defaultOpen = false,
  ...formProps
}: AssessmentFormDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(defaultOpen);
  const [dirty, setDirty] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Opened by the `?nova=1` link: closing also drops it, so a reload does not
  // bring the form back.
  function close() {
    setOpen(false);
    if (defaultOpen) router.replace(pathname);
  }

  function requestClose(next: boolean) {
    if (next) return setOpen(true);

    const decision = decideClose({ isDirty: dirty, isPending: false });
    if (decision === 'confirm') setConfirming(true);
    else close();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={requestClose}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Data, peso e altura são obrigatórios. Os demais valores podem
              ficar em branco.
            </DialogDescription>
          </DialogHeader>
          <AssessmentForm
            {...formProps}
            onSaved={close}
            onDirtyChange={setDirty}
          />
        </DialogContent>
      </Dialog>
      <DiscardChangesDialog
        open={confirming}
        onOpenChange={setConfirming}
        onDiscard={() => {
          setDirty(false);
          close();
        }}
      />
    </>
  );
}
