'use client';

import { Button } from '@/_components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { formatDecimal } from '@/_lib/decimalInput';
import { cn } from '@/_lib/utils';
import { formatLastWeightReference } from '@/_lib/weightReference';
import { canStepWeight } from '@/_lib/weightStepper';
import type { MeasurementRecordFormInput } from '@/_schema/progress';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import type { RecordFormLayout } from './recordForm';
import { WeightStepButton } from './weightStepButton';

const SHEET_WEIGHT_INPUT_CLASS =
  'h-16 border-0 border-l-0 bg-transparent px-0 shadow-none focus-within:ring-0 focus-within:ring-offset-0 [&_input]:text-center [&_input]:text-4xl [&_input]:font-semibold';

interface RecordFormDecimalFieldProps {
  name: 'heightCm' | 'waistCm' | 'hipCm';
  label: string;
  required?: boolean;
  disabled: boolean;
}

/** A plain decimal measurement field: height, waist or hip. */
export function RecordFormDecimalField({
  name,
  label,
  required,
  disabled,
}: RecordFormDecimalFieldProps) {
  const { control } = useFormContext<MeasurementRecordFormInput>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              required={required}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage role="alert" />
        </FormItem>
      )}
    />
  );
}

interface RecordFormWeightFieldProps {
  layout: RecordFormLayout;
  isPending: boolean;
  currentWeightKg: number | undefined;
  onStep: (direction: 1 | -1) => void;
  canStep: (direction: 1 | -1) => boolean;
}

type RecordFormStepButtonProps = Omit<RecordFormWeightFieldProps, 'layout'> & {
  direction: 1 | -1;
};

/** One stepper button, disabled while saving or at the weight limit. */
export function RecordFormStepButton({
  direction,
  isPending,
  currentWeightKg,
  onStep,
  canStep,
}: RecordFormStepButtonProps) {
  return (
    <WeightStepButton
      direction={direction}
      disabled={isPending || !canStepWeight(currentWeightKg, direction)}
      onStep={() => onStep(direction)}
      canStep={() => canStep(direction)}
    />
  );
}

/** Weight input flanked by the hold-to-repeat stepper buttons. */
export function RecordFormWeightField(props: RecordFormWeightFieldProps) {
  const { layout, isPending } = props;
  const { control } = useFormContext<MeasurementRecordFormInput>();
  const isSheet = layout === 'sheet';
  const stepButton = (direction: 1 | -1) => (
    <RecordFormStepButton
      direction={direction}
      isPending={isPending}
      currentWeightKg={props.currentWeightKg}
      onStep={props.onStep}
      canStep={props.canStep}
    />
  );

  return (
    <FormField
      control={control}
      name="weightKg"
      render={({ field }) => (
        <FormItem className="min-w-0">
          <FormLabel showMessage={false} className={cn(isSheet && 'sr-only')}>
            Peso (kg)
          </FormLabel>
          <div className={cn('flex items-center', isSheet ? 'gap-3' : 'gap-2')}>
            {stepButton(-1)}
            <FormControl>
              <Input
                {...field}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                required
                disabled={isPending}
                className={cn(
                  'min-w-0 flex-1',
                  isSheet && SHEET_WEIGHT_INPUT_CLASS
                )}
              />
            </FormControl>
            {stepButton(1)}
          </div>
          <FormMessage role="alert" className={cn(isSheet && 'text-center')} />
        </FormItem>
      )}
    />
  );
}

interface RecordFormWeightReferenceProps {
  layout: RecordFormLayout;
  referenceRecord: MeasurementRecordResponseDTO | null;
  weightDelta: string | null;
}

/**
 * Reference and difference exist only for a new record with history: neutral
 * tone, explicit sign and unit, never green or red (ADR-002).
 */
export function RecordFormWeightReference({
  layout,
  referenceRecord,
  weightDelta,
}: RecordFormWeightReferenceProps) {
  if (!referenceRecord) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 text-sm text-muted-foreground',
        layout === 'sheet' && 'items-center text-center'
      )}
    >
      <span>{formatLastWeightReference(referenceRecord)}</span>
      {weightDelta && <span>{weightDelta}</span>}
    </div>
  );
}

type RecordFormMainFieldsProps = RecordFormWeightFieldProps &
  Omit<RecordFormWeightReferenceProps, 'layout'>;

/**
 * Weight block for each layout: the sheet stacks a large weight input, the
 * dialog puts weight and height side by side. Both share the same stepper.
 */
export function RecordFormMainFields(props: RecordFormMainFieldsProps) {
  const { layout, isPending, referenceRecord, weightDelta } = props;
  const weightField = (
    <RecordFormWeightField
      layout={layout}
      isPending={isPending}
      currentWeightKg={props.currentWeightKg}
      onStep={props.onStep}
      canStep={props.canStep}
    />
  );
  const weightReference = (
    <RecordFormWeightReference
      layout={layout}
      referenceRecord={referenceRecord}
      weightDelta={weightDelta}
    />
  );

  if (layout === 'sheet') {
    return (
      <div>
        <p className="mb-1 text-center text-sm font-medium text-muted-foreground">
          Peso atual
        </p>
        {weightField}
        <p className="text-center text-sm text-muted-foreground">kg</p>
        {weightReference}
      </div>
    );
  }

  return (
    <div className="grid items-start gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        {weightField}
        {weightReference}
      </div>
      <RecordFormHeightField disabled={isPending} />
    </div>
  );
}

export function RecordFormHeightField({ disabled }: { disabled: boolean }) {
  return (
    <RecordFormDecimalField
      name="heightCm"
      label="Altura (cm)"
      required
      disabled={disabled}
    />
  );
}

interface RecordFormHeightSummaryProps {
  showHeight: boolean;
  previousHeightCm: number | undefined;
  isPending: boolean;
  onReveal: () => void;
}

/**
 * Sheet-only height row: collapsed to the last known height until the user
 * asks to change it, then the full height field.
 */
export function RecordFormHeightSummary({
  showHeight,
  previousHeightCm,
  isPending,
  onReveal,
}: RecordFormHeightSummaryProps) {
  const heightRegionId = useId();

  if (showHeight || previousHeightCm === undefined) {
    return (
      <div id={heightRegionId}>
        <RecordFormHeightField disabled={isPending} />
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto w-full justify-between gap-3 border border-line px-2 py-3 text-left"
      aria-expanded="false"
      aria-controls={heightRegionId}
      onClick={onReveal}
    >
      <span className="min-w-0 whitespace-normal">
        Altura · {formatDecimal(previousHeightCm)} cm (última)
      </span>
      <span className="text-sm font-semibold text-icon-accent">Alterar</span>
    </Button>
  );
}

interface RecordFormActionsProps {
  layout: RecordFormLayout;
  isPending: boolean;
  onCancel: () => void;
}

/** Footer actions: sticky full-width save on the sheet, cancel + save on the dialog. */
export function RecordFormActions({
  layout,
  isPending,
  onCancel,
}: RecordFormActionsProps) {
  return (
    <div
      className={cn(
        'mt-4 flex gap-2 bg-background pt-3',
        layout === 'sheet'
          ? 'sticky bottom-0 z-10 px-4 pb-4'
          : 'justify-end border-t'
      )}
    >
      {layout === 'dialog' && (
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      )}
      <Button
        type="submit"
        className={cn(layout === 'sheet' && 'h-11 w-full')}
        disabled={isPending}
      >
        {isPending ? 'Salvando…' : 'Salvar registro'}
      </Button>
    </div>
  );
}
