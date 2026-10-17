import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type {
  FormRecord,
  Template,
  TemplatePurpose,
} from '@/_types/clinicalRecords';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`ClinicalRecords: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

async function guarded<T>(
  source: string,
  load: () => Promise<T>
): Promise<T | LoadFailure> {
  try {
    return await load();
  } catch (error) {
    return toFailure(error, source);
  }
}

/** The caller's own active and discontinued templates for one purpose. */
export async function loadTemplates(
  purpose: TemplatePurpose
): Promise<Template[] | LoadFailure> {
  return await guarded('templates', () =>
    apiClient<Template[]>(`/professionals/templates?purpose=${purpose}`, {
      method: 'GET',
      cache: 'no-store',
    })
  );
}

/** A patient's filled records for one purpose, newest first (per the backend). */
export async function loadFormRecordHistory(
  clientId: string,
  purpose: TemplatePurpose
): Promise<FormRecord[] | LoadFailure> {
  return await guarded('form-records', () =>
    apiClient<FormRecord[]>(
      `/professionals/clients/${clientId}/form-records?purpose=${purpose}`,
      { method: 'GET', cache: 'no-store' }
    )
  );
}
