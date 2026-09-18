'use server';

import { AppError } from '@/_lib/AppError';
import { setAccessTokenCookie } from '@/_lib/accessTokenCookie';
import { apiClient } from '@/_lib/apiClient';

interface SignInResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  productId: string | null;
  productType?: string;
  productGroupId?: string;
  accessToken: string;
}

type AuthenticatedUser = Omit<SignInResponse, 'accessToken'>;

export async function actionSignIn({
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

export async function actionSignInWithGoogle(
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
