import { APP_ROUTES } from '@/_constants/routes';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const path = req.nextUrl.pathname;

    if (path.startsWith(APP_ROUTES.PRIVATE.DASHBOARD) && !req.nextauth.token) {
      return NextResponse.rewrite(new URL(APP_ROUTES.HOME, req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/restrict/:path*'],
};
