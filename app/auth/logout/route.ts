import { authClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const url = new URL(request.url);
  if (request.headers.get("origin") !== url.origin) return new Response("Invalid origin", { status: 403 });
  try { const client = await authClient(); await client.auth.signOut({ scope: "local" }); }
  catch { return new Response("Sign-out failed. Please try again.", { status: 503 }); }
  return NextResponse.redirect(new URL("/login", url.origin), 303);
}
export async function GET() {
  return new Response('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sign out</title></head><body style="font-family:system-ui;padding:2rem"><h1>Sign out of Community Pulse?</h1><form method="post"><button type="submit">Sign out</button></form><p><a href="/">Stay signed in</a></p></body></html>', { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store" } });
}
