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
import { useLatestRecord } from '@/_hooks/useLatestRecord';
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
import { RecordFormSkeleton } from './recordFormSkeleton';

interface RecordFormModalProps {
  existingRecord?: MeasurementRecordResponseDTO;
  trigger?: ReactNode;
  focusField?: RecordFormFocusField;
}

export function RecordFormModal({
  existingRecord,
  trigger,
  focusField,
}: RecordFormModalProps) {
  const isMobile = useIsMobile();
  const [layout, setLayout] = useState<RecordFormLayout | null>(null);
  // Cresce a cada abertura, para que a busca recomece do zero mesmo se o
  // formulário for reaberto antes de a anterior responder.
  const [openToken, setOpenToken] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  // Editar nunca busca: o registro sendo editado já é a fonte dos valores.
  const shouldFetchLatest = layout !== null && existingRecord === undefined;
  const latestState = useLatestRecord(shouldFetchLatest ? openToken : null);

  function openForm(event: MouseEvent<HTMLElement>) {
    triggerRef.current = event.currentTarget;
    setOpenToken(current => current + 1);
    setLayout(isMobile ? 'sheet' : 'dialog');
  }

  function closeForm() {
    setLayout(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  const title = existingRecord ? 'Editar registro' : 'Registrar novo';
  const description =
    'Informe peso e altura. O IMC é calculado automaticamente.';

  function renderBody(currentLayout: RecordFormLayout) {
    if (existingRecord) {
      return (
        <RecordForm
          layout={currentLayout}
          existingRecord={existingRecord}
          focusField={focusField}
          onCancel={closeForm}
          onSaved={closeForm}
        />
      );
    }

    // O formulário só monta com o resultado em mãos, para que os valores
    // iniciais nunca disputem com o que o usuário já digitou (ADR-005).
    if (latestState.status === 'loading') {
      return <RecordFormSkeleton layout={currentLayout} />;
    }

    return (
      <RecordForm
        layout={currentLayout}
        latest={latestState.status === 'ready' ? latestState.record : null}
        focusField={focusField}
        onCancel={closeForm}
        onSaved={closeForm}
      />
    );
  }

  const body = layout ? renderBody(layout) : null;

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
            className="max-h-[90dvh] overflow-y-auto rounded-t-2xl m-2 md:m-0 p-0 pb-[env(safe-area-inset-bottom)]"
          >
            <SheetHeader className="pb-0 text-left">
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
            {body}
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
            {body}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
