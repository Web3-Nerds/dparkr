import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuthenticated = !!req.nextauth.token;
    
    const publicRoutes = ['/'];
    
    const isProtectedRoute = pathname.startsWith('/dashboard') || 
                            pathname.startsWith('/profile') ||
                            pathname.startsWith('/settings'); 
    
    if (publicRoutes.includes(pathname) && isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
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
    '/settings/:path*' 
  ]
};
