'use client';

import { Button } from '@/_components/ui/button';
import { Plus } from 'lucide-react';
import { RecordFormModal } from './recordFormModal';

interface FloatingRegisterButtonProps {
  defaultHeightCm?: number;
  defaultWeightKg?: number;
}

export function FloatingRegisterButton({
  defaultHeightCm,
  defaultWeightKg,
}: FloatingRegisterButtonProps) {
  return (
    <RecordFormModal
      defaultHeightCm={defaultHeightCm}
      defaultWeightKg={defaultWeightKg}
      trigger={
        <Button
          aria-label="Registrar novo"
          className="fixed right-4 bottom-[calc(var(--bottom-nav-h,4.5rem)+env(safe-area-inset-bottom,0px)+1rem)] z-40 h-11 rounded-full px-5 shadow-lg md:hidden"
        >
          <Plus aria-hidden="true" />
          Registrar novo
        </Button>
      }
    />
  );
}
