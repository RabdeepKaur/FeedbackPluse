import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle CORS for widget API
  if (request.nextUrl.pathname.startsWith('/api/feedback')) {
    const response = NextResponse.next();
    
    // Allow all origins for the feedback widget
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }

  // Handle CORS for widget.js
  if (request.nextUrl.pathname === '/widget.js') {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Content-Type', 'application/javascript');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/feedback/:path*', '/widget.js'],
};