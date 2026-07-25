import { auth } from "@/auth";
import { NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

// Routes that have been migrated to next-intl's locale routing (live under
// app/[locale]/...). Everything else — admin routes and any not-yet-migrated
// public/client page — bypasses next-intl entirely and behaves exactly as
// it did before this file existed. Grows as more pages migrate.
const LOCALIZED_PATHS = ['/', '/login'];

function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue;
    if (pathname === `/${locale}`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

const VALID_REDIRECT_PATHS = [
  '/dashboard',
  '/solicitudes',
  '/itinerarios',
  '/chat',
  '/admin/login',
  '/client/dashboard',
];

function isValidRedirectPath(path: string): boolean {
  return VALID_REDIRECT_PATHS.some(validPath =>
    path === validPath || path.startsWith(validPath + '/')
  );
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const normalizedPath = stripLocale(pathname);
  const isLocalizedRoute = LOCALIZED_PATHS.some(
    (route) => normalizedPath === route || normalizedPath.startsWith(route + '/')
  );

  // Base response to fall through to when the auth logic below doesn't
  // redirect. For localized routes this carries next-intl's resolved-locale
  // headers, which the page render needs — a fresh NextResponse.next() here
  // would silently drop them and break locale resolution downstream.
  let baseResponse: NextResponse = NextResponse.next();

  if (isLocalizedRoute) {
    const intlResponse = handleI18nRouting(req);
    if (intlResponse.status >= 300 && intlResponse.status < 400) {
      // next-intl wants to redirect (e.g. adding a missing locale prefix) —
      // let it; the auth logic below re-runs on the resulting request.
      return intlResponse;
    }
    baseResponse = intlResponse;
  }

  const publicRoutes = ['/', '/login', '/register', '/unauthorized', '/chat', '/forgot-password', '/reset-password', '/contacto', '/terminos', '/privacidad', '/confirm-email-change'];
  const isPublicRoute = publicRoutes.some(route => normalizedPath === route || normalizedPath.startsWith(route + '/'));
  const isAuthRoute = normalizedPath.startsWith('/api/auth');
  const isAdminLoginRoute = normalizedPath.startsWith('/admin/login');

  if (isPublicRoute || isAuthRoute) {
    if (req.auth?.user && (normalizedPath === '/login' || normalizedPath === '/register')) {
      if (req.auth.user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/client/dashboard', req.url));
    }
    return baseResponse;
  }

  if (isAdminLoginRoute) {
    if (req.auth?.user) {
      if (req.auth.user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/chat', req.url));
    }
    return baseResponse;
  }

  if (!req.auth) {
    if (normalizedPath.startsWith('/admin')) {
      const loginUrl = new URL('/admin/login', req.url);
      const redirectPath = isValidRedirectPath(normalizedPath) ? normalizedPath : '/dashboard';
      loginUrl.searchParams.set('callbackUrl', redirectPath);
      return NextResponse.redirect(loginUrl);
    }
    const loginUrl = new URL('/login', req.url);
    const redirectPath = isValidRedirectPath(normalizedPath) ? normalizedPath : '/chat';
    loginUrl.searchParams.set('callbackUrl', redirectPath);
    return NextResponse.redirect(loginUrl);
  }

  const adminRoutes = ['/dashboard', '/solicitudes', '/itinerarios'];
  const isAdminRoute = adminRoutes.some(route =>
    normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  );

  if (isAdminRoute && req.auth.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  const clientRoutes = ['/client'];
  const isClientRoute = clientRoutes.some(route =>
    normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  );

  if (isClientRoute && req.auth.user?.role !== 'CLIENT') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return baseResponse;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
