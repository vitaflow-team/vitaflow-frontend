'use client';

import { Button } from '@/_components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RecordFormDecimalField } from './recordFormFields';

interface RecordFormOptionalFieldsProps {
  open: boolean;
  onToggle: () => void;
  disabled: boolean;
}

/** Collapsible waist and hip measurements, closed by default. */
export function RecordFormOptionalFields({
  open,
  onToggle,
  disabled,
}: RecordFormOptionalFieldsProps) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="h-auto w-fit px-0 py-1"
        aria-expanded={open}
        onClick={onToggle}
      >
        {open ? (
          <ChevronUp aria-hidden="true" />
        ) : (
          <ChevronDown aria-hidden="true" />
        )}
        Outras medidas (opcional)
      </Button>

      {open && (
        <div className="grid gap-3 sm:grid-cols-2">
          <RecordFormDecimalField
            name="waistCm"
            label="Cintura (cm)"
            disabled={disabled}
          />
          <RecordFormDecimalField
            name="hipCm"
            label="Quadril (cm)"
            disabled={disabled}
          />
        </div>
      )}
    </>
  );
}
