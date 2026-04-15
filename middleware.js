import { NextResponse } from 'next/server';

const protectedPaths = ['/home', '/explore', '/create', '/profile', '/messages', '/notifications'];

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  const isAuth = pathname === '/login' || pathname === '/signup';

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (isAuth && token) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/explore/:path*', '/create/:path*', '/profile/:path*', '/messages/:path*', '/notifications/:path*', '/login', '/signup'],
};