'use client';

import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/_components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/_components/ui/sheet';
import { useIsMobile } from '@/_hooks/useMobile';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { Slot } from '@radix-ui/react-slot';
import { Plus } from 'lucide-react';
import { type MouseEvent, type ReactNode, useRef, useState } from 'react';
import {
  RecordForm,
  type RecordFormFocusField,
  type RecordFormLayout,
} from './recordForm';

interface RecordFormModalProps {
  defaultHeightCm?: number;
  defaultWeightKg?: number;
  existingRecord?: MeasurementRecordResponseDTO;
  trigger?: ReactNode;
  focusField?: RecordFormFocusField;
}

export function RecordFormModal({
  defaultHeightCm,
  defaultWeightKg,
  existingRecord,
  trigger,
  focusField,
}: RecordFormModalProps) {
  const isMobile = useIsMobile();
  const [layout, setLayout] = useState<RecordFormLayout | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  function openForm(event: MouseEvent<HTMLElement>) {
    triggerRef.current = event.currentTarget;
    setLayout(isMobile ? 'sheet' : 'dialog');
  }

  function closeForm() {
    setLayout(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  const title = existingRecord ? 'Editar registro' : 'Registrar novo';
  const description =
    'Informe peso e altura. O IMC é calculado automaticamente.';
  const form = layout ? (
    <RecordForm
      layout={layout}
      defaultHeightCm={defaultHeightCm}
      defaultWeightKg={defaultWeightKg}
      existingRecord={existingRecord}
      focusField={focusField}
      onCancel={closeForm}
      onSaved={closeForm}
    />
  ) : null;

  return (
    <>
      <Slot onClick={openForm}>
        {trigger ?? (
          <Button className="hidden md:inline-flex">
            <Plus aria-hidden="true" />
            Registrar novo
          </Button>
        )}
      </Slot>

      {layout === 'sheet' && (
        <Sheet open onOpenChange={nextOpen => !nextOpen && closeForm()}>
          <SheetContent
            side="bottom"
            className="max-h-[90dvh] overflow-y-auto rounded-t-2xl p-0 pb-[env(safe-area-inset-bottom)]"
          >
            <SheetHeader className="pb-0 text-left">
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            {form}
          </SheetContent>
        </Sheet>
      )}

      {layout === 'dialog' && (
        <Dialog open onOpenChange={nextOpen => !nextOpen && closeForm()}>
          <DialogContent className="border-2 border-primary shadow-2xl sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {form}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
