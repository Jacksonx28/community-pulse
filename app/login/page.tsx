import { authConfig, safeReturnTo } from "@/lib/supabase/server";
import { BrandMark } from "../brand";
export const dynamic = "force-dynamic";
export default async function Login({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const config = authConfig();
  const ready = !!config.url && !!config.key;
  const next = encodeURIComponent(safeReturnTo(params.next));
  return <main className="login-shell"><section className="login-art" aria-hidden="true"/><section className="login-panel"><a href="/"><BrandMark/> Community Pulse</a><h1>Your next collaboration starts here.</h1><p>Sign in to represent your community, list a project, or find work as a CM.</p>{params.error && <p role="alert">We couldn’t complete sign-in. Please try again.</p>}<div className="login-options">{ready && config.google ? <a className="primary-btn" href={`/auth/start?provider=google&next=${next}`}>Continue with Google</a> : <button className="secondary-btn" disabled>Google sign-in coming soon</button>}{ready && config.x ? <a className="secondary-btn" href={`/auth/start?provider=x&next=${next}`}>Continue with X</a> : <button className="secondary-btn" disabled>X sign-in coming soon</button>}</div><p className="muted">Your first sign-in creates your account. You can edit your public profiles afterward.</p><a href="/">Browse the directory</a></section></main>;
}
