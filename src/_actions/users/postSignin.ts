'use server';

import { AppError } from '@/_lib/AppError';
import { apiClient } from '@/_lib/apiClient';

interface SignInResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  accessToken: string;
}

export async function actionSignIn({
  email,
  password,
  socialLogin = false,
}: {
  email: string;
  password: string;
  socialLogin?: boolean;
}): Promise<SignInResponse | undefined> {
  return await apiClient<SignInResponse>('/users/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password, socialLogin }),
  }).catch(error => {
    throw new AppError(
      error instanceof AppError
        ? error.message
        : 'Falha ao autenticar o usuário.'
    );
  });
}
