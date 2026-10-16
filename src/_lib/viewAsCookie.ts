import 'server-only';

import {
  VIEW_AS_COOKIE_NAME,
  VIEW_AS_MAX_AGE_SECONDS,
} from '@/_constants/viewAsCookie';
import { cookies } from 'next/headers';

export { VIEW_AS_COOKIE_NAME };

export interface ViewAsState {
  token: string;
  sessionId: string;
  targetLabel: string;
}

const viewAsCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: VIEW_AS_MAX_AGE_SECONDS,
  path: '/',
};

export async function setViewAsCookie(state: ViewAsState): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    VIEW_AS_COOKIE_NAME,
    JSON.stringify(state),
    viewAsCookieOptions
  );
}

export async function getViewAsState(): Promise<ViewAsState | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(VIEW_AS_COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ViewAsState>;
    if (
      typeof parsed.token === 'string' &&
      typeof parsed.sessionId === 'string' &&
      typeof parsed.targetLabel === 'string'
    ) {
      return parsed as ViewAsState;
    }
    return null;
  } catch {
    return null;
  }
}

export async function clearViewAsCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(VIEW_AS_COOKIE_NAME, '', {
    ...viewAsCookieOptions,
    maxAge: 0,
  });
}
