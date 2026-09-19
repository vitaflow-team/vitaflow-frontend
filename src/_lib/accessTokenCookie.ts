import { cookies } from 'next/headers';

export const ACCESS_TOKEN_COOKIE_NAME = 'vf_access_token';
export const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 12;

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  path: '/',
};

export async function setAccessTokenCookie(accessToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    ACCESS_TOKEN_COOKIE_NAME,
    accessToken,
    accessTokenCookieOptions
  );
}

export async function clearAccessTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE_NAME, '', {
    ...accessTokenCookieOptions,
    maxAge: 0,
  });
}
