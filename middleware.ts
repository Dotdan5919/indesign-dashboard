import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Check if we're on a dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    try {
      // Try to get the token cookie
      const hasAuthCookie = request.cookies.has('token'); // replace 'token' with your actual cookie name
      
      if (!hasAuthCookie) {
        // Redirect to login if no auth cookie found
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      // If there's any error, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: '/dashboard/:path*',
}
