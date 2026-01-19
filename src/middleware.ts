import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware for route protection
 * Mock implementation - for production, use real authentication
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // Check if user has session (simplified check)
  // In production, validate actual session token from cookies
  const hasSession = request.cookies.has("session");

  if (!hasSession && !isPublicRoute) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    // Redirect to dashboard if already authenticated
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
