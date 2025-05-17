import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Extract school ID from the path
  const pathParts = pathname.split('/').filter(Boolean);
  const schoolId = pathParts[0] || '';

  // Create response
  const response = NextResponse.next();
  
  // Set school ID in headers for all routes
  response.headers.set('x-school-id', schoolId);
  
  return response;
}

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