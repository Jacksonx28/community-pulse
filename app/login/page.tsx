import { authConfig, safeReturnTo } from "@/lib/supabase/server";
import { BrandMark } from "../brand";
export const dynamic = "force-dynamic";
export default async function Login({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const config = authConfig();
  const ready = !!config.url && !!config.key;
  const next = encodeURIComponent(safeReturnTo(params.next));
  return <main className="login-shell">
    <div className="login-art" aria-hidden="true"><img src="/community-splash.webp" alt="" width={2172} height={724}/></div>
    <section className="login-panel">
      <a className="login-brand" href="/"><BrandMark/> Community Pulse</a>
      <div className="login-content">
        <div className="login-introduction">
          <p className="login-eyebrow">Good connections. New possibilities.</p>
          <h1>Your next <span>collaboration</span> starts here.</h1>
          <p className="login-description">Sign in to represent your community, list a project, or find work as a CM.</p>
        </div>
        <div className="login-access">
          <h2>Welcome to Community Pulse</h2>
          <p className="login-access-caption">One account for all your roles.</p>
          {params.error && <p className="login-error" role="alert">We couldn’t complete sign-in. Please try again.</p>}
          <div className="login-options">
            {ready && config.google ? <a className="primary-btn" href={`/auth/start?provider=google&next=${next}`}>Continue with Google</a> : <button className="secondary-btn" disabled>Google sign-in coming soon</button>}
            {ready && config.x ? <a className="secondary-btn" href={`/auth/start?provider=x&next=${next}`}>Continue with X</a> : <button className="secondary-btn" disabled>X sign-in coming soon</button>}
          </div>
          <p className="login-note">Your first sign-in creates your account. You can edit your public profiles afterward.</p>
          <a className="login-browse" href="/">Browse the directory <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  </main>;
}
