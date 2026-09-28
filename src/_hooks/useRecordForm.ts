'use client';

import { createMeasurementRecord } from '@/_actions/progress/createMeasurementRecord';
import { updateMeasurementRecord } from '@/_actions/progress/updateMeasurementRecord';
import { useAlertHook } from '@/_hooks/alertHook';
import { useDebouncedValue } from '@/_hooks/useDebouncedValue';
import { getBmiPreview } from '@/_lib/bmi';
import { formatDecimal, stepWeight } from '@/_lib/decimalInput';
import {
  finiteDecimal,
  firstInvalidRecordField,
  getRecordFormDefaults,
} from '@/_lib/recordFormValues';
import { announceWeight, formatWeightDelta } from '@/_lib/weightReference';
import { canStepWeight } from '@/_lib/weightStepper';
import {
  measurementRecordSchema,
  type MeasurementRecordFormData,
  type MeasurementRecordFormInput,
} from '@/_schema/progress';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import type { RecordFormMethods } from '@/_types/recordFormMethods';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  useForm,
  useWatch,
  type FieldErrors,
  type Resolver,
} from 'react-hook-form';
import { useServerAction } from 'zsa-react';

/** Idle time before the weight is announced by the live region (ADR-003). */
const ANNOUNCE_DEBOUNCE_MS = 500;

interface UseRecordFormInput {
  layout: 'sheet' | 'dialog';
  latest?: MeasurementRecordResponseDTO | null;
  existingRecord?: MeasurementRecordResponseDTO;
  focusField?: 'weightKg' | 'heightCm';
  onSaved: () => void;
}

function useRecordFormMethods(
  defaultValues: MeasurementRecordFormInput
): RecordFormMethods {
  return useForm<
    MeasurementRecordFormInput,
    unknown,
    MeasurementRecordFormData
  >({
    resolver: zodResolver(measurementRecordSchema) as Resolver<
      MeasurementRecordFormInput,
      unknown,
      MeasurementRecordFormData
    >,
    defaultValues,
  });
}

function useFocusOnOpen(
  methods: RecordFormMethods,
  focusField: UseRecordFormInput['focusField']
) {
  useEffect(() => {
    if (!focusField) return;

    const frame = requestAnimationFrame(() => methods.setFocus(focusField));
    return () => cancelAnimationFrame(frame);
  }, [focusField, methods]);
}

/** Which collapsible regions are open, and how validation errors reveal them. */
function useRecordFormReveal(
  methods: RecordFormMethods,
  initialShowHeight: boolean
) {
  const [showHeight, setShowHeight] = useState(initialShowHeight);
  const [showOptional, setShowOptional] = useState(false);

  function revealHeight() {
    setShowHeight(true);
    requestAnimationFrame(() => methods.setFocus('heightCm'));
  }

  function toggleOptional() {
    setShowOptional(current => !current);
  }

  function revealInvalidField(errors: FieldErrors<MeasurementRecordFormInput>) {
    if (errors.waistCm || errors.hipCm) setShowOptional(true);
    if (errors.heightCm) setShowHeight(true);

    const firstInvalidField = firstInvalidRecordField(errors);
    if (firstInvalidField) {
      requestAnimationFrame(() => methods.setFocus(firstInvalidField));
    }
  }

  return {
    showHeight,
    showOptional,
    revealHeight,
    toggleOptional,
    revealInvalidField,
  };
}

function useWeightStepper(
  methods: RecordFormMethods,
  lastKnownWeightKg: number | undefined
) {
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

  // Read from the form, not from the render: hold-to-repeat checks the limit
  // between two steps, before any new render has happened.
  function canStepNow(direction: 1 | -1) {
    return canStepWeight(
      finiteDecimal(methods.getValues('weightKg')),
      direction
    );
  }

  return { changeWeight, canStepNow };
}

function useRecordSubmit({
  existingRecord,
  onSaved,
}: Pick<UseRecordFormInput, 'existingRecord' | 'onSaved'>) {
  const router = useRouter();
  const { openError } = useAlertHook();
  const createAction = useServerAction(createMeasurementRecord);
  const updateAction = useServerAction(updateMeasurementRecord);

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

  return {
    submitRecord,
    isPending: createAction.isPending || updateAction.isPending,
  };
}

/**
 * Only the settled value is announced: holding a stepper button must not
 * flood the screen reader with every repetition (ADR-003).
 */
function useWeightAnnouncement(weightKg: string): string {
  const settledWeight = useDebouncedValue(weightKg, ANNOUNCE_DEBOUNCE_MS);
  return announceWeight(
    finiteDecimal(settledWeight) === undefined ? '' : settledWeight
  );
}

/** State, derived values, and handlers behind `RecordForm`. */
export function useRecordForm(input: UseRecordFormInput) {
  const { layout, latest, existingRecord, focusField, onSaved } = input;
  const referenceRecord = existingRecord ? null : (latest ?? null);
  const previousHeightCm =
    existingRecord?.heightCm ?? referenceRecord?.heightCm;
  const lastKnownWeightKg =
    existingRecord?.weightKg ?? referenceRecord?.weightKg;
  const methods = useRecordFormMethods(
    getRecordFormDefaults({ latest, existingRecord })
  );
  const reveal = useRecordFormReveal(
    methods,
    layout === 'dialog' ||
      previousHeightCm === undefined ||
      focusField === 'heightCm'
  );
  const stepper = useWeightStepper(methods, lastKnownWeightKg);
  const { submitRecord, isPending } = useRecordSubmit({
    existingRecord,
    onSaved,
  });
  const [weightKg, heightCm] = useWatch({
    control: methods.control,
    name: ['weightKg', 'heightCm'],
  });
  const weightAnnouncement = useWeightAnnouncement(weightKg);
  useFocusOnOpen(methods, focusField);
  const currentWeightKg = finiteDecimal(weightKg);

  return {
    ...reveal,
    ...stepper,
    methods,
    isPending,
    referenceRecord,
    previousHeightCm,
    currentWeightKg,
    weightAnnouncement,
    preview: getBmiPreview(currentWeightKg, finiteDecimal(heightCm)),
    weightDelta: referenceRecord
      ? formatWeightDelta(currentWeightKg, referenceRecord.weightKg)
      : null,
    onSubmit: methods.handleSubmit(submitRecord, reveal.revealInvalidField),
  };
}
