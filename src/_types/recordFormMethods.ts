import type {
  MeasurementRecordFormData,
  MeasurementRecordFormInput,
} from '@/_schema/progress';
import type { UseFormReturn } from 'react-hook-form';

/** The `react-hook-form` instance behind the measurement record form. */
export type RecordFormMethods = UseFormReturn<
  MeasurementRecordFormInput,
  unknown,
  MeasurementRecordFormData
>;
