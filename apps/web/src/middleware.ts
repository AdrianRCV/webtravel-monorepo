import { auth } from "@/auth";
import { NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

const LOCALIZED_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/confirm-email-change',
  '/unauthorized',
  '/chat',
  '/contacto',
  '/terminos',
  '/privacidad',
  '/client',
];

function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}

function currentLocale(pathname: string): string | null {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return null;
}

function withLocale(path: string, locale: string | null): string {
  if (!locale || locale === routing.defaultLocale) return path;
  return `/${locale}${path}`;
}

const VALID_REDIRECT_PATHS = [
  '/dashboard',
  '/solicitudes',
  '/itinerarios',
  '/chat',
  '/admin/login',
  '/client/dashboard',
  '/client/trips',
  '/client/settings',
];

function isValidRedirectPath(path: string): boolean {
  return VALID_REDIRECT_PATHS.some(validPath =>
    path === validPath || path.startsWith(validPath + '/')
  );
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const normalizedPath = stripLocale(pathname);
  const locale = currentLocale(pathname);
  const isLocalizedRoute = LOCALIZED_PATHS.some(
    (route) => normalizedPath === route || normalizedPath.startsWith(route + '/')
  );

  let baseResponse: NextResponse = NextResponse.next();

  if (isLocalizedRoute) {
    const intlResponse = handleI18nRouting(req);
    if (intlResponse.status >= 300 && intlResponse.status < 400) {
      return intlResponse;
    }
    baseResponse = intlResponse;
  }

  const session = await auth();

  const publicRoutes = ['/', '/login', '/register', '/unauthorized', '/chat', '/forgot-password', '/reset-password', '/verify-email', '/contacto', '/terminos', '/privacidad', '/confirm-email-change'];
  const isPublicRoute = publicRoutes.some(route => normalizedPath === route || normalizedPath.startsWith(route + '/'));
  const isAuthRoute = normalizedPath.startsWith('/api/auth');
  const isAdminLoginRoute = normalizedPath.startsWith('/admin/login');

  if (isPublicRoute || isAuthRoute) {
    if (session?.user && (normalizedPath === '/login' || normalizedPath === '/register')) {
      if (session.user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.redirect(new URL(withLocale('/client/dashboard', locale), req.url));
    }
    return baseResponse;
  }

  if (isAdminLoginRoute) {
    if (session?.user) {
      if (session.user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.redirect(new URL(withLocale('/chat', locale), req.url));
    }
    return baseResponse;
  }

  if (!session) {
    if (normalizedPath.startsWith('/admin')) {
      const loginUrl = new URL('/admin/login', req.url);
      const redirectPath = isValidRedirectPath(normalizedPath) ? normalizedPath : '/dashboard';
      loginUrl.searchParams.set('callbackUrl', redirectPath);
      return NextResponse.redirect(loginUrl);
    }
    // Allow unauthenticated access to specific client routes (e.g., /client/trips/[id])
    // Other client routes will handle their own auth logic per-page
    if (normalizedPath.startsWith('/client/trips/')) {
      return baseResponse;
    }
    const loginUrl = new URL(withLocale('/login', locale), req.url);
    const redirectPath = isValidRedirectPath(normalizedPath) ? normalizedPath : '/chat';
    loginUrl.searchParams.set('callbackUrl', redirectPath);
    return NextResponse.redirect(loginUrl);
  }

  const adminRoutes = ['/dashboard', '/solicitudes', '/itinerarios'];
  const isAdminRoute = adminRoutes.some(route =>
    normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  );

  if (isAdminRoute && session.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL(withLocale('/unauthorized', locale), req.url));
  }

  const clientRoutes = ['/client'];
  const isClientRoute = clientRoutes.some(route =>
    normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  );

  // Allow unauthenticated access to trip detail pages
  const isTripDetailPage = normalizedPath.startsWith('/client/trips/');

  if (isClientRoute && !isTripDetailPage && session.user?.role !== 'CLIENT') {
    return NextResponse.redirect(new URL(withLocale('/unauthorized', locale), req.url));
  }

  if (isClientRoute && !isTripDetailPage && !session.accessToken) {
    const loginUrl = new URL(withLocale('/login', locale), req.url);
    const redirectPath = isValidRedirectPath(normalizedPath) ? normalizedPath : '/chat';
    loginUrl.searchParams.set('callbackUrl', redirectPath);
    return NextResponse.redirect(loginUrl);
  }

  return baseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
