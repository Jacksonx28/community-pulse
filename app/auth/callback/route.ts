import { NextResponse } from "next/server";
import { authClient, safeReturnTo } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    try {
      const supabase = await authClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const response = NextResponse.redirect(new URL(safeReturnTo(url.searchParams.get("next")), url.origin));
        response.headers.set("Cache-Control", "private, no-store");
        return response;
      }
    } catch { /* Show a retry instead of exposing provider details. */ }
  }
  return NextResponse.redirect(new URL("/login?error=callback", url.origin));
}
