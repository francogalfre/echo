import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

// Optimistic cookie check only — the real session is validated client-side in
// the dashboard via useSession. Never trust this alone for sensitive actions.
export function proxy(request: NextRequest): NextResponse {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding"],
};
