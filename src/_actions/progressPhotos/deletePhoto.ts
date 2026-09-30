'use server';

import { apiClient } from '@/_lib/apiClient';
import { parseBackendId } from '@/_lib/idValidation';
import { toSafeActionError } from '@/_lib/safeActionError';
import { deletePhotoSchema } from '@/_schema/progressPhotos';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';
import { PHOTO_NOT_FOUND, PREMIUM_REQUIRED } from './progressPhotosErrors';

export const actionDeletePhoto = createServerAction()
  .input(deletePhotoSchema)
  .handler(async ({ input: { photoId } }) => {
    const session = await auth();
    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    const id = parseBackendId(photoId);

    try {
      await apiClient(`/progress-photos/${id}`, { method: 'DELETE' });
    } catch (error) {
      throw toSafeActionError('deletePhoto', error, [
        PHOTO_NOT_FOUND,
        PREMIUM_REQUIRED,
      ]);
    }
  });
