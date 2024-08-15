import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('jwtToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login-user', request.url));
  }

  const { pathname } = request.nextUrl;

  const allowedRoutes: Record<string, string> = {
    '/student': 'Student',
    '/faculty': 'Faculty',
    '/industryexpert': 'IndustryExpert',
    '/uniadmin': 'UniversityAdmin',
  };

  const roleResponse = fetch('https://localhost:7053/api/user-profile/authorized-user-info', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!(await roleResponse).ok) {
    return NextResponse.redirect(new URL('/auth/login-user', request.url));
  }

  const { role } = await (await roleResponse).json();

  for (const [route, expectedRole] of Object.entries(allowedRoutes)) {
    if (pathname.startsWith(route) && role !== expectedRole) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/faculty/:path*', '/industryexpert/:path*', '/uniadmin/:path*'],
};
