import { redirect } from "next/navigation";
import { authClient, authConfig, safeReturnTo } from "./supabase/server";

export async function getUser() {
  const config = authConfig();
  if (!config.url || !config.key) return null;
  const supabase = await authClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const user = data.user;
  const metadata = user.user_metadata;
  return {
    userId: user.id,
    email: user.email || "",
    displayName: String(metadata.full_name || metadata.name || user.email || "Member"),
    provider: user.app_metadata.provider === "x" ? "X" : user.app_metadata.provider === "google" ? "Google" : "Email",
  };
}
export function signInPath(returnTo = "/") { return "/login?next=" + encodeURIComponent(safeReturnTo(returnTo)); }
export function signOutPath() { return "/auth/logout"; }
export async function requireUser(returnTo: string) {
  const user = await getUser();
  if (!user) redirect(signInPath(returnTo));
  return user;
}
