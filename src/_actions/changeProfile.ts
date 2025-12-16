'use server';

import { getEnv } from '@/_lib/getenv';
import { profileSchema } from '@/_schema/profile';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { createServerAction, ZSAError } from 'zsa';

export const actionChangeProfile = createServerAction()
  .input(profileSchema)
  .handler(async ({ input: userProfile }) => {
    const session = await getServerSession(options);
    if (!session) return null;

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

    await fetch(getEnv('BACKEND_URL') + '/profile/profile', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: formData,
      cache: 'no-store',
    }).catch(() => {
      throw new ZSAError(
        'ERROR',
        'Error accessing the new user registration service.'
      );
    });
  });
