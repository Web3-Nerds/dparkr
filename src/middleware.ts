import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.nextauth.token;
    
    const protectedRoutes = ['/driver', '/owner', '/profile', '/settings', 'account'];
    const publicRoutes = ['/'];
    
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.includes(pathname);
    
    if (isPublicRoute && isAuthenticated) {
      return NextResponse.redirect(new URL('/driver', req.url));
    }
    
    if (isProtectedRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, 
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/settings/:path*',
    '/driver/:path*',
    '/owner/:path*',
    '/account/:path*',
  ]
};
