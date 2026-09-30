import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { hasPaidSubscription } from '@/_lib/settingsProfile';
import type { LoadFailure } from '@/_types/loadFailure';
import type {
  CompareResult,
  PhotoAngle,
  ProgressPhoto,
} from '@/_types/progressPhotos';
import type { SettingsProfile } from '@/_types/settingsProfile';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error(`Progress photos: ${source} failed.`, { status });
  return 'failed';
}

// The Premium gate applies before the consent step and everything else
// (PRD Business Rules), so it is checked up front via the user's own
// profile rather than reacting to a 402 from a photos endpoint — a Free
// user should never even attempt a photos request.
export async function loadIsPremium(): Promise<boolean | LoadFailure> {
  try {
    const profile = await apiClient<SettingsProfile>('/profile', {
      method: 'GET',
    });
    return hasPaidSubscription(profile);
  } catch (error) {
    return toFailure(error, 'profile');
  }
}

export async function loadConsentStatus(): Promise<boolean | LoadFailure> {
  try {
    const result = await apiClient<{ consented: boolean }>(
      '/progress-photos/consent',
      { method: 'GET', cache: 'no-store' }
    );
    return result.consented;
  } catch (error) {
    return toFailure(error, 'consent');
  }
}

export async function loadPhotosByAngle(
  angle: PhotoAngle
): Promise<ProgressPhoto[] | LoadFailure> {
  try {
    return await apiClient<ProgressPhoto[]>(`/progress-photos?angle=${angle}`, {
      method: 'GET',
      cache: 'no-store',
    });
  } catch (error) {
    return toFailure(error, 'list');
  }
}

export async function loadCompare(
  photoIdA: string,
  photoIdB: string
): Promise<CompareResult | LoadFailure> {
  try {
    return await apiClient<CompareResult>(
      `/progress-photos/compare?a=${encodeURIComponent(photoIdA)}&b=${encodeURIComponent(photoIdB)}`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'compare');
  }
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
