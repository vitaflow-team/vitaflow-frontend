'use client';

import { Form } from '@/_components/ui/form';
import { useRecordForm } from '@/_hooks/useRecordForm';
import { cn } from '@/_lib/utils';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { RecordFormBmiStrip } from './recordFormBmiStrip';
import {
  RecordFormActions,
  RecordFormHeightSummary,
  RecordFormMainFields,
} from './recordFormFields';
import { RecordFormOptionalFields } from './recordFormOptionalFields';

export type RecordFormLayout = 'sheet' | 'dialog';
export type RecordFormFocusField = 'weightKg' | 'heightCm';

interface RecordFormProps {
  layout: RecordFormLayout;
  /** The user's latest record; only a new record uses it. */
  latest?: MeasurementRecordResponseDTO | null;
  existingRecord?: MeasurementRecordResponseDTO;
  focusField?: RecordFormFocusField;
  onCancel: () => void;
  onSaved: () => void;
}

export function RecordForm({ onCancel, ...options }: RecordFormProps) {
  const { layout } = options;
  const form = useRecordForm(options);

  return (
    <Form {...form.methods}>
      <form
        noValidate
        onSubmit={form.onSubmit}
        className="flex min-h-0 flex-col"
      >
        <div
          className={cn('flex flex-col gap-4', layout === 'sheet' && 'px-4')}
        >
          <RecordFormMainFields
            layout={layout}
            isPending={form.isPending}
            currentWeightKg={form.currentWeightKg}
            onStep={form.changeWeight}
            canStep={form.canStepNow}
            referenceRecord={form.referenceRecord}
            weightDelta={form.weightDelta}
          />
          <p aria-live="polite" className="sr-only">
            {form.weightAnnouncement}
          </p>
          {layout === 'sheet' && (
            <RecordFormHeightSummary
              showHeight={form.showHeight}
              previousHeightCm={form.previousHeightCm}
              isPending={form.isPending}
              onReveal={form.revealHeight}
            />
          )}
          <RecordFormBmiStrip preview={form.preview} />
          <RecordFormOptionalFields
            open={form.showOptional}
            onToggle={form.toggleOptional}
            disabled={form.isPending}
          />
        </div>
        <RecordFormActions
          layout={layout}
          isPending={form.isPending}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
}
