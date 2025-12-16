import { auth } from '@/auth';
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

  const session = await auth();
  if (session?.user?.accessToken) {
    headers.set('Authorization', `Bearer ${session.user.accessToken}`);
  }

  if (
    init?.body &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...init,
    headers,
    cache: init?.cache || 'no-store',
  };

  try {
    const response = await fetch(url, config);

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
  } catch (error) {
    console.error(`[API Client Error] URL: ${url}`, error);
    if (error instanceof AppError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new AppError(error.message);
    }
    throw new AppError('Erro ao conectar com o servidor.');
  }
}
