import 'server-only';

import type { AuthenticatedUser } from '@/_types/authenticatedUser';
import type { SignInResponse } from '@/_types/signInResponse';
import { setAccessTokenCookie } from './accessTokenCookie';
import { apiClient } from './apiClient';
import { AppError } from './AppError';

const GOOGLE_FAILURE = 'Falha ao autenticar via Google.';

// The backend's own message never travels further — only its status and its
// machine-readable `code`, which is what lets the caller tell a refusal the
// person can act on (a staff account, a receptionist email) from any other
// failure.
function googleFailure(error: unknown): AppError {
  if (error instanceof AppError && error.code) {
    return new AppError(GOOGLE_FAILURE, error.statusCode, error.code);
  }
  return new AppError(GOOGLE_FAILURE);
}

async function startSession(
  response: SignInResponse
): Promise<AuthenticatedUser> {
  const { accessToken, ...user } = response;
  await setAccessTokenCookie(accessToken);
  return user;
}

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
    const response = await apiClient<SignInResponse>('/users/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    return await startSession(response);
  } catch {
    throw new AppError('Falha ao autenticar o usuário.');
  }
}

export async function signInWithGoogleIdToken(
  idToken: string
): Promise<AuthenticatedUser> {
  try {
    const response = await apiClient<SignInResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });

    return await startSession(response);
  } catch (error) {
    throw googleFailure(error);
  }
}

/**
 * Connects the Google identity behind `idToken` to the signed-in account
 * (the one the access-token cookie belongs to). `intent` is the short-lived
 * proof that this account asked for it; no account identifier is sent.
 */
export async function linkGoogleIdToken(
  idToken: string,
  intent: string
): Promise<AuthenticatedUser> {
  try {
    const response = await apiClient<SignInResponse>('/auth/google/link', {
      method: 'POST',
      body: JSON.stringify({ idToken, intent }),
    });

    return await startSession(response);
  } catch (error) {
    throw googleFailure(error);
  }
}
