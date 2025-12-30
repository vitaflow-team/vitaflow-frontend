'use server';

import { apiClient } from '@/_lib/apiClient';
import { profileSchema } from '@/_schema/profile';
import { auth } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

export const actionChangeProfile = createServerAction()
  .input(profileSchema)
  .handler(async ({ input: userProfile }) => {
    const session = await auth();

    if (!session?.user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
    }

    const formData = new FormData();
    formData.append('name', userProfile.name);
    formData.append('email', userProfile.email);
    formData.append('phone', userProfile.phone);
    formData.append('birthDate', userProfile.birthDate);
    formData.append('addressLine1', userProfile.address.addressLine1);
    formData.append('addressLine2', userProfile.address.addressLine2);
    formData.append('district', userProfile.address.district);
    formData.append('city', userProfile.address.city);
    formData.append('region', userProfile.address.region);
    formData.append('postalCode', userProfile.address.postalCode);
    if (userProfile.avatar instanceof File) {
      formData.append('avatar', userProfile.avatar);
    }

    try {
      await apiClient('/profile', {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new ZSAError('ERROR', error.message);
      }
      throw new ZSAError('ERROR', 'Erro ao atualizar perfil.');
    }
  });
