import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest): NextResponse {
  const sessionCookie = getSessionCookie(request);
  const isAuthPath = AUTH_PATHS.some((path) => request.nextUrl.pathname.startsWith(path));

  if (sessionCookie && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!sessionCookie && !isAuthPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding", "/login", "/register"],
};
