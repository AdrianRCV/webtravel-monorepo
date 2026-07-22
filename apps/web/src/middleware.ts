import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  const publicRoutes = ['/login', '/unauthorized', '/chat'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith('/api/auth');
  
  if (isPublicRoute || isAuthRoute) {
    return NextResponse.next();
  }
  
  if (!req.auth) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  const adminRoutes = ['/', '/solicitudes', '/itinerarios'];
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isAdminRoute && req.auth.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
