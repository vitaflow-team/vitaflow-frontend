import 'server-only';

import type { AuthenticatedUser } from '@/_types/authenticatedUser';
import type { SignInResponse } from '@/_types/signInResponse';
import { setAccessTokenCookie } from './accessTokenCookie';
import { apiClient } from './apiClient';
import { AppError } from './AppError';

// Deliberately not a 'use server' module: these calls issue the access-token
// cookie, so only the Auth.js callbacks in `auth.ts` may reach them. Exporting
// them from a Server Action file would make them publicly invocable.
export async function signInWithCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthenticatedUser> {
  try {
    const { accessToken, ...user } = await apiClient<SignInResponse>(
      '/users/signin',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    await setAccessTokenCookie(accessToken);
    return user;
  } catch {
    throw new AppError('Falha ao autenticar o usuário.');
  }
}

export async function signInWithGoogleIdToken(
  idToken: string
): Promise<AuthenticatedUser> {
  try {
    const { accessToken, ...user } = await apiClient<SignInResponse>(
      '/auth/google',
      {
        method: 'POST',
        body: JSON.stringify({ idToken }),
      }
    );

    await setAccessTokenCookie(accessToken);
    return user;
  } catch {
    throw new AppError('Falha ao autenticar via Google.');
  }
}
