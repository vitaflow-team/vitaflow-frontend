import 'server-only';

import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE_NAME } from './accessTokenCookie';
import { AppError } from './AppError';
import { env } from './env';
import { getViewAsState } from './viewAsCookie';

export interface ApiClientOptions {
  /**
   * Forces the caller's own access-token cookie even when a "ver como"
   * session is active — every backoffice-management call (directory,
   * start/end session, staff, audit log) must always act as the staff
   * member themselves, never as whoever they're currently viewing as
   * (platform-admin-access ADR-004).
   */
  ownToken?: boolean;
}

// A "ver como" session's token stands in for the caller's own, for every
// request made while browsing the target's screens — the existing app is
// reused as-is, and the backend's own global write-block guard is what
// actually enforces read-only, not anything on this side (ADR-004).
async function resolveAccessToken(
  options: ApiClientOptions | undefined
): Promise<string | undefined> {
  const viewAs = options?.ownToken ? null : await getViewAsState();
  if (viewAs) return viewAs.token;
  return (await cookies()).get(ACCESS_TOKEN_COOKIE_NAME)?.value;
}

/** The backend's `{ message, code, details }` answer as an AppError. */
async function backendError(response: Response): Promise<AppError> {
  let message = 'Ocorreu um erro inesperado.';
  let code: string | undefined;
  let details: unknown;
  try {
    const data = await response.json();
    if (data && typeof data.message === 'string') message = data.message;
    if (data && typeof data.code === 'string') code = data.code;
    if (data && data.details !== undefined) details = data.details;
  } catch {}

  const error = new AppError(message, response.status, code);
  error.details = details;
  return error;
}

export async function apiClient<T = unknown>(
  path: string,
  init?: RequestInit,
  options?: ApiClientOptions
): Promise<T> {
  const baseUrl = env.BACKEND_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  const headers = new Headers(init?.headers);

  const accessToken = await resolveAccessToken(options);
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

  headers.set('x-application-secret', env.APP_SECRET_KEY);

  const config: RequestInit = {
    ...init,
    headers,
    cache: init?.cache || 'no-store',
  };

  // Neither failure is a backend answer, so neither may carry the 400 that
  // Server Actions map to "check the data you sent" (safeActionError).
  const response = await fetch(url, config).catch(error => {
    if (error instanceof AppError) {
      throw new AppError(error.message, error.statusCode);
    }
    throw new AppError('Erro ao conectar com o servidor.', 503);
  });

  if (!response.ok) throw await backendError(response);

  if (response.status === 204) {
    return {} as T;
  }

  return await response.json();
}
