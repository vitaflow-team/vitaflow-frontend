import { APP_ROUTES } from '@/_constants/routes';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default auth((req: any) => {
  const path = req.nextUrl.pathname;
  const isLogged = !!req.auth;

  if (path.startsWith(APP_ROUTES.PRIVATE.DASHBOARD) && !isLogged) {
    return NextResponse.rewrite(new URL(APP_ROUTES.HOME, req.url));
  }
});

export const config = {
  matcher: ['/restrict/:path*'],
};
