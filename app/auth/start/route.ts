import { NextResponse } from "next/server";
import { authClient, authConfig, safeReturnTo } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider");
  const config = authConfig();
  const failure = () => NextResponse.redirect(new URL("/login?error=unavailable", url.origin));
  if (!config.url || !config.key || (provider !== "google" && provider !== "x")) return failure();
  if (provider === "google" ? !config.google : !config.x) return failure();
  const callback = new URL("/auth/callback", url.origin);
  callback.searchParams.set("next", safeReturnTo(url.searchParams.get("next")));
  try {
    const supabase = await authClient();
    const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: callback.toString(), skipBrowserRedirect: true } });
    if (error || !data.url) return failure();
    return NextResponse.redirect(data.url);
  } catch { return failure(); }
}
