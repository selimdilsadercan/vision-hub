import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Array of public routes that don't require authentication
const publicRoutes = ["/login", "/forgot-password", "/legal-agreements"];

export function middleware(request: NextRequest) {
  // Check if the requested path is a public route
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  // For now, just let all requests through and let client-side auth handle protection
  return NextResponse.next();
}

// Configure the paths that middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)"
  ]
};
