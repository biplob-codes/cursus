import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/** Redirects to /signin when there is no authenticated user. Use on pages. */
export async function requireUser() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/signin");
  return session.user;
}

/**
 * Session user or null. Prefer this in server actions that return ActionState
 * instead of redirecting on missing auth.
 */
export async function getSessionUser() {
  const session = await getSession();
  return session?.user ?? null;
}
