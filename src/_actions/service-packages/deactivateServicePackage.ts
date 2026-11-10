'use server';

import { SERVICE_PACKAGE_WRITE_ERRORS } from '@/_constants/servicePackageErrors';
import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const deactivateServicePackage = createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    const id = parseBackendId(input.id);

    try {
      await apiClient(`/service-packages/${id}/deactivate`, {
        method: 'POST',
      });
    } catch (error) {
      throw toSafeActionError(
        'deactivateServicePackage',
        error,
        SERVICE_PACKAGE_WRITE_ERRORS
      );
    }
  });
