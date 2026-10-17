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
  console.error(`AcademiaClinicalRecords: ${source} failed.`, { status });
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

/** The academia's own shared catalog for one purpose (ADR-004, 9.2). */
export async function loadAcademiaTemplates(
  purpose: TemplatePurpose
): Promise<Template[] | LoadFailure> {
  return await guarded('templates', () =>
    apiClient<Template[]>(`/academia/templates?purpose=${purpose}`, {
      method: 'GET',
      cache: 'no-store',
    })
  );
}

/** The academia's catalog as available for one specific student (9.3). */
export async function loadAcademiaTemplatesForClient(
  clientId: string,
  purpose: TemplatePurpose
): Promise<Template[] | LoadFailure> {
  return await guarded('client-templates', () =>
    apiClient<Template[]>(
      `/academia/clients/${clientId}/form-records/templates?purpose=${purpose}`,
      { method: 'GET', cache: 'no-store' }
    )
  );
}

/** A student's filled records for one purpose, newest first (9.3). */
export async function loadAcademiaFormRecordHistory(
  clientId: string,
  purpose: TemplatePurpose
): Promise<FormRecord[] | LoadFailure> {
  return await guarded('form-records', () =>
    apiClient<FormRecord[]>(
      `/academia/clients/${clientId}/form-records?purpose=${purpose}`,
      { method: 'GET', cache: 'no-store' }
    )
  );
}
