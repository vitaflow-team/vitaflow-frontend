'use server';

import { SERVICE_PACKAGE_WRITE_ERRORS } from '@/_constants/servicePackageErrors';
import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { servicePackageSchema } from '@/_schema/servicePackages';
import { auth } from '@/auth';
import { z } from 'zod';
import { ZSAError, createServerAction } from 'zsa';

export const updateServicePackage = createServerAction()
  .input(servicePackageSchema.and(z.object({ id: z.string() })))
  .handler(async ({ input: { id, ...patch } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }
    const packageId = parseBackendId(id);

    try {
      await apiClient(`/service-packages/${packageId}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
    } catch (error) {
      throw toSafeActionError(
        'updateServicePackage',
        error,
        SERVICE_PACKAGE_WRITE_ERRORS
      );
    }
  });
