import 'server-only';

import { apiClient } from '@/_lib/apiClient';

export async function loadCheckInEligibility(): Promise<boolean> {
  try {
    const { eligible } = await apiClient<{ eligible: boolean }>(
      '/checkins/eligibility',
      { method: 'GET', cache: 'no-store' }
    );
    return eligible;
  } catch (error) {
    console.error('Check-in eligibility: failed to load.', error);
    return false;
  }
}
