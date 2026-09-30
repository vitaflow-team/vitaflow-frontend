'use server';

import { apiClient } from '@/_lib/apiClient';
import { toSafeActionError } from '@/_lib/safeActionError';
import { uploadPhotoSchema } from '@/_schema/progressPhotos';
import type { ProgressPhoto } from '@/_types/progressPhotos';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import {
  CONSENT_REQUIRED,
  IMAGE_TOO_LARGE,
  INVALID_IMAGE,
  PREMIUM_REQUIRED,
} from './progressPhotosErrors';

export const actionUploadPhoto = createServerAction()
  .input(uploadPhotoSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const formData = new FormData();
    formData.append('angle', input.angle);
    formData.append('file', input.file);

    try {
      return await apiClient<ProgressPhoto>('/progress-photos', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      throw toSafeActionError('uploadPhoto', error, [
        CONSENT_REQUIRED,
        PREMIUM_REQUIRED,
        INVALID_IMAGE,
        IMAGE_TOO_LARGE,
      ]);
    }
  });
