'use server';

import { profileSchema } from '@/_schema/profile';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { createServerAction, ZSAError } from 'zsa';

export const actionChangeProfile = createServerAction()
  .input(profileSchema)
  .handler(async ({ input: userProfile }) => {
    const session = await getServerSession(options);
    if (!session) return null;

    await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/profile/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify(userProfile),
      cache: 'no-store',
    }).catch(() => {
      throw new ZSAError(
        'ERROR',
        'Error accessing the new user registration service.'
      );
    });
  });
