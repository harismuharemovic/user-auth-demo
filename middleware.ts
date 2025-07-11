import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.includes(path);

  if (isProtectedRoute) {
    // Check for session cookie
    const sessionCookie = request.cookies.get('myapp_session');

    // If no session cookie exists, redirect to auth
    if (!sessionCookie || !sessionCookie.value) {
      console.log('No session cookie found, redirecting to /auth');
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // For now, we'll trust that if the cookie exists, the user is authenticated
    // In a production app, you might want to verify the cookie signature here
    console.log('Session cookie found, allowing access to dashboard');
  }

  return NextResponse.next();
}

// Configure which routes should trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
