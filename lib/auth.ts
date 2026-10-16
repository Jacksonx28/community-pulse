import { database } from "./pulse-db";
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
  const account=await database().prepare("SELECT display_name,username,avatar FROM accounts WHERE user_id=?").bind(user.id).first<{display_name:string;username:string;avatar:string}>();
  return {
    username:account?.username||"",
    avatar:account?account.avatar:String(metadata.avatar_url||metadata.picture||""),
    userId: user.id,
    email: user.email || "",
    displayName: account?.display_name || String(metadata.full_name || metadata.name || user.email || "Member"),
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
