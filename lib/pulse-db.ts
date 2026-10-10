import { env } from "cloudflare:workers";
export function database(): D1Database {
  const binding = env.DB as D1Database | undefined;
  if (!binding) throw new Error("Directory storage is unavailable.");
  return binding;
}
