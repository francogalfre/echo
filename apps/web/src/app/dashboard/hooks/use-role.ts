"use client";

import { authClient } from "@/lib/auth-client";

export type Role = "owner" | "admin" | "member";

type UseRoleResult = {
  role: Role | undefined;
  isPending: boolean;
  isAdmin: boolean;
};

export function useRole(): UseRoleResult {
  const { data, isPending } = authClient.useActiveMemberRole();
  const role: Role | undefined =
    data?.role === "owner" || data?.role === "admin" || data?.role === "member"
      ? data.role
      : undefined;

  return { role, isPending, isAdmin: role === "owner" || role === "admin" };
}
