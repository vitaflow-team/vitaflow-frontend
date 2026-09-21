'use client';

import { createMeasurementRecord } from '@/_actions/progress/createMeasurementRecord';
import { updateMeasurementRecord } from '@/_actions/progress/updateMeasurementRecord';
import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { useAlertHook } from '@/_hooks/alertHook';
import { getBmiPreview } from '@/_lib/bmi';
import {
  formatDecimal,
  normalizeDecimalInput,
  stepWeight,
} from '@/_lib/decimalInput';
import {
  formatBmi,
  getBmiStripTone,
  type BmiStripTone,
} from '@/_lib/progressDisplay';
import { cn } from '@/_lib/utils';
import {
  measurementRecordSchema,
  type MeasurementRecordFormData,
  type MeasurementRecordFormInput,
} from '@/_schema/progress';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import {
  useForm,
  useWatch,
  type FieldErrors,
  type Resolver,
} from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { BmiBadge } from './bmiBadge';

export type RecordFormLayout = 'sheet' | 'dialog';
export type RecordFormFocusField = 'weightKg' | 'heightCm';

interface RecordFormProps {
  layout: RecordFormLayout;
  defaultHeightCm?: number;
  defaultWeightKg?: number;
  existingRecord?: MeasurementRecordResponseDTO;
  focusField?: RecordFormFocusField;
  onCancel: () => void;
  onSaved: () => void;
}

const STRIP_TONE_CLASS: Record<BmiStripTone, string> = {
  'sage-bg': 'bg-sage-bg',
  'info-bg': 'bg-info-bg',
  'warn-bg': 'bg-warn-bg',
  muted: 'bg-muted',
};

function finiteDecimal(value: string): number | undefined {
  const normalized = normalizeDecimalInput(value);
  return typeof normalized === 'number' && Number.isFinite(normalized)
    ? normalized
    : undefined;
}

function getDefaultValues({
  defaultHeightCm,
  defaultWeightKg,
  existingRecord,
}: Pick<
  RecordFormProps,
  'defaultHeightCm' | 'defaultWeightKg' | 'existingRecord'
>): MeasurementRecordFormInput {
  return {
    weightKg: formatDecimal(existingRecord?.weightKg ?? defaultWeightKg),
    heightCm: formatDecimal(existingRecord?.heightCm ?? defaultHeightCm),
    waistCm: formatDecimal(existingRecord?.waistCm ?? undefined),
    hipCm: formatDecimal(existingRecord?.hipCm ?? undefined),
  };
}

export function RecordForm({
  layout,
  defaultHeightCm,
  defaultWeightKg,
  existingRecord,
  focusField,
  onCancel,
  onSaved,
}: RecordFormProps) {
  const previousHeightCm = existingRecord?.heightCm ?? defaultHeightCm;
  const lastKnownWeightKg = existingRecord?.weightKg ?? defaultWeightKg;
  const [showHeight, setShowHeight] = useState(
    layout === 'dialog' ||
      previousHeightCm === undefined ||
      focusField === 'heightCm'
  );
  const [showOptional, setShowOptional] = useState(false);
  const heightRegionId = useId();
  const router = useRouter();
  const { openError } = useAlertHook();
  const createAction = useServerAction(createMeasurementRecord);
  const updateAction = useServerAction(updateMeasurementRecord);
  const methods = useForm<
    MeasurementRecordFormInput,
    unknown,
    MeasurementRecordFormData
  >({
    resolver: zodResolver(measurementRecordSchema) as Resolver<
      MeasurementRecordFormInput,
      unknown,
      MeasurementRecordFormData
    >,
    defaultValues: getDefaultValues({
      defaultHeightCm,
      defaultWeightKg,
      existingRecord,
    }),
  });
  const [weightKg, heightCm] = useWatch({
    control: methods.control,
    name: ['weightKg', 'heightCm'],
  });
  const preview = getBmiPreview(
    finiteDecimal(weightKg),
    finiteDecimal(heightCm)
  );
  const stripTone = preview ? getBmiStripTone(preview.classification) : 'muted';
  const isPending = createAction.isPending || updateAction.isPending;

  useEffect(() => {
    if (!focusField) return;

    const frame = requestAnimationFrame(() => methods.setFocus(focusField));
    return () => cancelAnimationFrame(frame);
  }, [focusField, methods]);

  function revealHeight() {
    setShowHeight(true);
    requestAnimationFrame(() => methods.setFocus('heightCm'));
  }

  function changeWeight(direction: 1 | -1) {
    const nextWeight = stepWeight(
      finiteDecimal(methods.getValues('weightKg')),
      direction,
      lastKnownWeightKg
    );
    methods.setValue('weightKg', formatDecimal(nextWeight), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: methods.formState.isSubmitted,
    });
  }

  async function submitRecord(data: MeasurementRecordFormData) {
    const [, error] = existingRecord
      ? await updateAction.execute({ id: existingRecord.id, ...data })
      : await createAction.execute(data);

    if (error) {
      openError(
        error.message || 'Não foi possível salvar o registro.',
        'Atenção!',
        'error'
      );
      return;
    }

    onSaved();
    router.refresh();
  }

  function revealInvalidField(errors: FieldErrors<MeasurementRecordFormInput>) {
    if (errors.waistCm || errors.hipCm) setShowOptional(true);
    if (errors.heightCm) setShowHeight(true);

    const firstInvalidField = (
      ['weightKg', 'heightCm', 'waistCm', 'hipCm'] as const
    ).find(name => errors[name]);
    if (firstInvalidField) {
      requestAnimationFrame(() => methods.setFocus(firstInvalidField));
    }
  }

  const weightField = (
    <FormField
      control={methods.control}
      name="weightKg"
      render={({ field }) => (
        <FormItem className={cn(layout === 'sheet' && 'min-w-0 flex-1')}>
          <FormLabel
            showMessage={false}
            className={cn(layout === 'sheet' && 'sr-only')}
          >
            Peso (kg)
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              required
              disabled={isPending}
              className={cn(
                layout === 'sheet' &&
                  'h-16 border-0 border-l-0 bg-transparent px-0 shadow-none focus-within:ring-0 focus-within:ring-offset-0 [&_input]:text-center [&_input]:text-4xl [&_input]:font-semibold'
              )}
            />
          </FormControl>
          <FormMessage
            role="alert"
            className={cn(layout === 'sheet' && 'text-center')}
          />
        </FormItem>
      )}
    />
  );

  const heightField = (
    <FormField
      control={methods.control}
      name="heightCm"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>Altura (cm)</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              required
              disabled={isPending}
            />
          </FormControl>
          <FormMessage role="alert" />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...methods}>
      <form
        noValidate
        onSubmit={methods.handleSubmit(submitRecord, revealInvalidField)}
        className="flex min-h-0 flex-col"
      >
        <div
          className={cn('flex flex-col gap-4', layout === 'sheet' && 'px-4')}
        >
          {layout === 'sheet' ? (
            <div>
              <p className="mb-1 text-center text-sm font-medium text-muted-foreground">
                Peso atual
              </p>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  className="size-11 rounded-full"
                  aria-label="Diminuir peso em 0,1 kg"
                  disabled={isPending}
                  onClick={() => changeWeight(-1)}
                >
                  <Minus aria-hidden="true" />
                </Button>
                {weightField}
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  className="size-11 rounded-full"
                  aria-label="Aumentar peso em 0,1 kg"
                  disabled={isPending}
                  onClick={() => changeWeight(1)}
                >
                  <Plus aria-hidden="true" />
                </Button>
              </div>
              <p className="text-center text-sm text-muted-foreground">kg</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {weightField}
              {heightField}
            </div>
          )}

          {layout === 'sheet' &&
            (!showHeight && previousHeightCm !== undefined ? (
              <Button
                type="button"
                variant="ghost"
                className="h-auto w-full justify-between gap-3 border-y border-line px-0 py-3 text-left"
                aria-expanded="false"
                aria-controls={heightRegionId}
                onClick={revealHeight}
              >
                <span className="min-w-0 whitespace-normal">
                  Altura ·{' '}
                  {previousHeightCm.toLocaleString('pt-BR', {
                    maximumFractionDigits: 1,
                  })}{' '}
                  cm (última)
                </span>
                <span className="text-sm font-semibold text-icon-accent">
                  Alterar
                </span>
              </Button>
            ) : (
              <div id={heightRegionId}>{heightField}</div>
            ))}

          <div
            aria-live="polite"
            className={cn(
              'flex min-h-20 items-center justify-between gap-3 rounded-xl px-4 py-3',
              STRIP_TONE_CLASS[stripTone]
            )}
          >
            <div>
              <p className="text-sm font-medium">Prévia do IMC</p>
              {preview ? (
                <p className="text-2xl font-semibold">
                  {formatBmi(preview.bmi)}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Preencha peso e altura para calcular.
                </p>
              )}
            </div>
            {preview && <BmiBadge classification={preview.classification} />}
          </div>

          <Button
            type="button"
            variant="ghost"
            className="h-auto w-fit px-0 py-1"
            aria-expanded={showOptional}
            onClick={() => setShowOptional(current => !current)}
          >
            {showOptional ? (
              <ChevronUp aria-hidden="true" />
            ) : (
              <ChevronDown aria-hidden="true" />
            )}
            Outras medidas (opcional)
          </Button>

          {showOptional && (
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={methods.control}
                name="waistCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showMessage={false}>Cintura (cm)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage role="alert" />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="hipCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel showMessage={false}>Quadril (cm)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage role="alert" />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

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
      </form>
    </Form>
  );
}
