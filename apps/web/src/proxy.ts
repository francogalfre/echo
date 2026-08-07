import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

import { isSafeRedirectPath } from "./lib/safe-redirect";

const AUTH_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest): NextResponse {
  const sessionCookie = getSessionCookie(request);
  const isAuthPath = AUTH_PATHS.some((path) => request.nextUrl.pathname.startsWith(path));

  if (sessionCookie && isAuthPath) {
    const callbackURL = request.nextUrl.searchParams.get("callbackURL");
    const destination = isSafeRedirectPath(callbackURL) ? callbackURL : "/dashboard";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (!sessionCookie && !isAuthPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set(
      "callbackURL",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding",
    "/login",
    "/register",
    "/accept-invitation/:path*",
  ],
};
