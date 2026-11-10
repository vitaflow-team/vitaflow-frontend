'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import type { ServicePackage } from '@/_types/servicePackages';
import { auth } from '@/auth';
import { ZSAError, createServerAction } from 'zsa';

export const listServicePackages = createServerAction().handler(async () => {
  const session = await auth();
  if (!session?.user) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
  }

  try {
    return await apiClient<ServicePackage[]>('/service-packages', {
      method: 'GET',
    });
  } catch (error) {
    throw toSafeActionError('listServicePackages', error);
  }
});
