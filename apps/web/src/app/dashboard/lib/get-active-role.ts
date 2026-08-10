import { env } from "@echo/env/web";
import { cookies } from "next/headers";

export type ActiveRole = "owner" | "admin" | "member";

export async function getActiveRole(): Promise<ActiveRole | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_SERVER_URL}/api/auth/organization/get-active-member-role`,
      { headers: { cookie: cookieHeader }, cache: "no-store" },
    );

    if (!response.ok) return null;

    const data = (await response.json()) as { role: string };
    return data.role === "owner" || data.role === "admin" ? data.role : "member";
  } catch (error) {
    // Silent fail — role guard will handle missing role
    void error;
    return null;
  }
}
