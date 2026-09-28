import { formatDecimal, normalizeDecimalInput } from '@/_lib/decimalInput';
import { initialFormValues } from '@/_lib/latestRecord';
import type { MeasurementRecordFormInput } from '@/_schema/progress';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import type { FieldErrors } from 'react-hook-form';

/** Field order used to decide which invalid field receives focus first. */
const FIELD_ORDER = ['weightKg', 'heightCm', 'waistCm', 'hipCm'] as const;

type RecordFormFieldName = (typeof FIELD_ORDER)[number];

/** Parses a typed decimal, keeping only finite numbers. */
export function finiteDecimal(value: string): number | undefined {
  const normalized = normalizeDecimalInput(value);
  return typeof normalized === 'number' && Number.isFinite(normalized)
    ? normalized
    : undefined;
}

/**
 * Initial form values: an edited record keeps its own values; a new record
 * starts from the latest weight and height, with optional fields empty.
 */
export function getRecordFormDefaults({
  latest,
  existingRecord,
}: {
  latest?: MeasurementRecordResponseDTO | null;
  existingRecord?: MeasurementRecordResponseDTO;
}): MeasurementRecordFormInput {
  if (existingRecord) {
    return {
      weightKg: formatDecimal(existingRecord.weightKg),
      heightCm: formatDecimal(existingRecord.heightCm),
      waistCm: formatDecimal(existingRecord.waistCm ?? undefined),
      hipCm: formatDecimal(existingRecord.hipCm ?? undefined),
    };
  }

  const { weightKg, heightCm } = initialFormValues(latest ?? null);

  return { weightKg, heightCm, waistCm: '', hipCm: '' };
}

/** First invalid field in visual order, or `undefined` when all are valid. */
export function firstInvalidRecordField(
  errors: FieldErrors<MeasurementRecordFormInput>
): RecordFormFieldName | undefined {
  return FIELD_ORDER.find(name => errors[name]);
}
