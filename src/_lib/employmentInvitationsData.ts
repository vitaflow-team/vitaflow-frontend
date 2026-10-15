import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import type { EducatorAcademiaInvitation } from '@/_types/educatorEmployment';

export async function loadEmploymentInvitations(): Promise<
  EducatorAcademiaInvitation[]
> {
  try {
    return await apiClient<EducatorAcademiaInvitation[]>(
      '/educators/me/academia-invitations',
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    console.error('Employment invitations: failed to load.', error);
    return [];
  }
}
