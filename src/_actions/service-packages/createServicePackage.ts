'use server';

import { SERVICE_PACKAGE_WRITE_ERRORS } from '@/_constants/servicePackageErrors';
import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { servicePackageSchema } from '@/_schema/servicePackages';
import { auth } from '@/auth';
import { ZSAError, createServerAction } from 'zsa';

export const createServicePackage = createServerAction()
  .input(servicePackageSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    try {
      await apiClient('/service-packages', {
        method: 'POST',
        body: JSON.stringify(input),
      });
    } catch (error) {
      throw toSafeActionError(
        'createServicePackage',
        error,
        SERVICE_PACKAGE_WRITE_ERRORS
      );
    }
  });
