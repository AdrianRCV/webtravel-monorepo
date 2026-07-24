import { auth } from "@/auth";
import { NextResponse } from "next/server";

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

  const publicRoutes = ['/', '/login', '/register', '/unauthorized', '/chat', '/forgot-password', '/reset-password', '/contacto', '/terminos', '/privacidad'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  const isAuthRoute = pathname.startsWith('/api/auth');
  const isAdminLoginRoute = pathname.startsWith('/admin/login');
  
  if (isPublicRoute || isAuthRoute) {
    if (req.auth?.user && (pathname === '/login' || pathname === '/register')) {
      if (req.auth.user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/client/dashboard', req.url));
    }
    return NextResponse.next();
  }
  
  if (isAdminLoginRoute) {
    if (req.auth?.user) {
      if (req.auth.user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/chat', req.url));
    }
    return NextResponse.next();
  }
  
  if (!req.auth) {
    if (pathname.startsWith('/admin')) {
      const loginUrl = new URL('/admin/login', req.url);
      const redirectPath = isValidRedirectPath(pathname) ? pathname : '/dashboard';
      loginUrl.searchParams.set('callbackUrl', redirectPath);
      return NextResponse.redirect(loginUrl);
    }
    const loginUrl = new URL('/login', req.url);
    const redirectPath = isValidRedirectPath(pathname) ? pathname : '/chat';
    loginUrl.searchParams.set('callbackUrl', redirectPath);
    return NextResponse.redirect(loginUrl);
  }
  
  const adminRoutes = ['/dashboard', '/solicitudes', '/itinerarios'];
  const isAdminRoute = adminRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAdminRoute && req.auth.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  const clientRoutes = ['/client'];
  const isClientRoute = clientRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isClientRoute && req.auth.user?.role !== 'CLIENT') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
