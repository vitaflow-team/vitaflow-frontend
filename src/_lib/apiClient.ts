import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE_NAME } from './accessTokenCookie';
import { AppError } from './AppError';
import { getEnv } from './getenv';

export async function apiClient<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const baseUrl = getEnv('BACKEND_URL');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  const headers = new Headers(init?.headers);

  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (
    init?.body &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const appSecretKey = process.env.APP_SECRET_KEY;
  if (!appSecretKey) {
    throw new AppError('Internal Error: APP_SECRET_KEY is not defined.');
  }
  headers.set('x-application-secret', appSecretKey);

  const config: RequestInit = {
    ...init,
    headers,
    cache: init?.cache || 'no-store',
  };

  const response = await fetch(url, config).catch(error => {
    if (error instanceof AppError) {
      throw new AppError(error.message);
    }
    throw new AppError('Erro ao conectar com o servidor.');
  });

  if (!response.ok) {
    let errorMessage = 'Ocorreu um erro inesperado.';
    try {
      const data = await response.json();
      if (data && typeof data.message === 'string') {
        errorMessage = data.message;
      }
    } catch {}
    throw new AppError(errorMessage, response.status);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return await response.json();
}
