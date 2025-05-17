import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const pathname = request.nextUrl.pathname;

  // If this is a 404 page, add the school ID to the headers
  if (pathname === '/404' || pathname === '/_not-found') {
    const schoolId = pathname.split('/')[1];
    const response = NextResponse.next();
    response.headers.set('x-school-id', schoolId || '');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/404', '/_not-found'],
}; 