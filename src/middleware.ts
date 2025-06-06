import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.nextauth.token;

    const publicRoutes = ['/'];

    const protectedRoutes = ['/dashboard', '/driver', 'owner', '/profile', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (publicRoutes.includes(pathname) && isAuthenticated) {
      return NextResponse.redirect(new URL('/driver', req.url));
    }

    if (isProtectedRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL('/', req.url));
    }
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
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/driver/:path*',
    '/owner/:path*',
  ]
};
