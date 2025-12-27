import { APP_ROUTES } from '@/_constants/routes';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default auth(async (req: any) => {
  const path = req.nextUrl.pathname;
  const isLogged = !!req.auth;

  if (
    path === APP_ROUTES.SIGN_IN ||
    path === APP_ROUTES.SIGN_UP ||
    path.startsWith('/api/auth')
  ) {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { ratelimit } = await import('@/_lib/ratelimit');
        const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
        const { success } = await ratelimit.limit(ip);

        if (!success) {
          return new NextResponse('Too Many Requests', { status: 429 });
        }
      } catch (error) {
        console.warn('Rate Limit Error:', error);
      }
    }
  }

  if (path.startsWith(APP_ROUTES.ROUTE_PRIVATE) && !isLogged) {
    return NextResponse.rewrite(new URL(APP_ROUTES.HOME, req.url));
  }

  if (!APP_ROUTES.EXCLUDED_ROUTES.includes(path)) {
    for (const ITEM of APP_ROUTES.PRIVATE) {
      if (
        ITEM.URL === path &&
        !ITEM.PRODUCT_TYPE.includes(req.auth?.user?.productType)
      ) {
        const referer = req.headers.get('referer');
        return NextResponse.redirect(
          referer ?? new URL(APP_ROUTES.EXCLUDED_ROUTES[0], req.url)
        );
      }
    }
  }
});

export const config = {
  matcher: ['/restrict/:path*'],
};
