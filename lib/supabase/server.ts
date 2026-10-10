import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "cloudflare:workers";

export function authConfig() {
  const values = env as unknown as Record<string, string | undefined>;
  return {
    url: values.SUPABASE_URL || "",
    key: values.SUPABASE_PUBLISHABLE_KEY || "",
    google: values.AUTH_GOOGLE_ENABLED === "true",
    x: values.AUTH_X_ENABLED === "true",
  };
}

export async function authClient() {
  const { url, key } = authConfig();
  if (!url || !key) throw new Error("Sign-in is awaiting configuration.");
  const store = await cookies();
  return createServerClient(url, key, {
    cookieOptions: { httpOnly: true, sameSite: "lax", secure: url.startsWith("https://"), path: "/" },
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) {
        try { values.forEach(({ name, value, options }) => store.set(name, value, options)); }
        catch { /* Server Components cannot set cookies; proxy handles refresh. */ }
      },
    },
  });
}

export function safeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const url = new URL(value, "https://pulse.local");
    if (url.origin !== "https://pulse.local" || url.pathname.startsWith("/auth/") || url.pathname === "/login") return "/";
    return url.pathname + url.search + url.hash;
  } catch { return "/"; }
}
