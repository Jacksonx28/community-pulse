# Community Pulse

Web3 project, CM and community directory with project-specific collaboration requests, whitelist allocation budgets, hiring and a private request inbox.

This export runs independently of ChatGPT Sites. Google and X OAuth use Supabase Auth; the existing application data uses Cloudflare D1. It is a full-stack Worker, not a GitHub Pages static site.

## Status

- Production build and TypeScript check pass.
- Collaboration permissions, allocation rules, migrations and request visibility checks pass.
- OAuth gating, code-exchange failure handling, redirects, invalid session rejection and logout origin checks pass with mocked providers.
- Real Google/X sign-in must be tested after configuring your accounts. No provider credentials are included.
- Current ChatGPT-hosted production data is not included. This deployment starts with a new D1 database. ChatGPT and Supabase IDs differ; migrate existing ownership only after independently confirming account ownership, never by blindly matching emails.
- Email/password signup, reset emails and alerts are not implemented in this export. Social account passwords are managed by Google/X.

## 1. Create the repository

Create a GitHub repository named `community-pulse` in your own account. Push these sources there, without `node_modules`, `dist`, local databases or credentials. The project includes `.gitignore`.

## 2. Create Cloudflare resources

Create a Cloudflare account and a D1 database named `community-pulse`. Copy its database ID into `wrangler.jsonc`, replacing the placeholder UUID. You do not need a purchased domain.

For CLI setup, after installing Node.js 22.13 or newer:

```sh
npm ci
npx wrangler login
npx wrangler d1 create community-pulse
```

Cloudflare will print the real database ID. Save it in `wrangler.jsonc` and commit that configuration. Database IDs are identifiers, not API tokens.

Connect the repository from Cloudflare Workers & Pages > Create > Import a repository. Use:

- Build command: `npm run build`
- Deploy command: `npm run deploy`
- Root directory: repository root

The deploy command applies pending D1 migrations before publishing the built Worker. Cloudflare assigns a `workers.dev` HTTPS address. Check Cloudflare's actual dashboard limits before enabling paid services.

CLI alternative:

```sh
npm run build
npm run deploy
```

The deploy script deliberately rejects the placeholder database ID.

## 3. Configure Supabase Auth

Create a Supabase project. In its settings, copy the project URL and publishable key. No service-role/admin key is needed.

Set these values in `wrangler.jsonc` under `vars`, then rebuild and deploy:

- `SUPABASE_URL`: `https://YOUR_PROJECT_REF.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY`: your Supabase publishable key
- `AUTH_GOOGLE_ENABLED`: `true` only when Google is configured
- `AUTH_X_ENABLED`: `true` only when X is configured

These two Supabase values are public application configuration. OAuth client secrets belong only in Supabase's provider settings, never this repository. Do not enable either button until its provider has been configured.

In Supabase Authentication > URL Configuration:

- Site URL: the assigned Cloudflare HTTPS address
- Redirect URL allowlist: `https://YOUR_WORKER.YOUR_SUBDOMAIN.workers.dev/auth/callback**`

The suffix allows the same-origin `next` query used to return to account pages. Keep the pattern restricted to this one host and callback path.

## 4. Enable Google

Create a Google Cloud project and OAuth web client. Configure the consent screen for Community Pulse, allowing only basic profile/email/OpenID access.

- Authorized JavaScript origin: your Cloudflare site origin
- Authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

Add the Google client ID and secret in Supabase Authentication > Sign In / Providers > Google. Test with the Google consent screen's allowed test users before publishing its audience.

The Google callback is Supabase's URL. The application callback in step 3 is a different URL; both must be configured correctly.

## 5. Enable X

Create an X developer app and use OAuth 2.0 web app authentication. Add the required website URL, privacy policy and terms pages for your actual service.

- Provider callback: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- Website URL: your Cloudflare site origin

Put the OAuth 2.0 client ID and secret into Supabase's X / Twitter OAuth 2.0 provider settings. This export uses provider `x`, not the deprecated OAuth 1 Twitter provider. X developer access and API pricing are determined by X; automatic DMs and social API calls are not part of this integration.

## 6. Verify before inviting people

Run local checks:

```sh
npm run verify
node scripts/verify-auth.mjs
npx tsc --noEmit
npm run build
```

With provider configuration in place, test each enabled provider on the deployed HTTPS site:

1. Open `/login`, sign in, and verify the correct name/account appears.
2. Create a community or CM profile, refresh, and confirm it persists.
3. Use a separate account to confirm it cannot edit your profiles or read your private inbox.
4. Send a request, accept a project invitation, and verify assignment permissions.
5. Sign out, check protected pages redirect to login, then sign in as another account.
6. Confirm the session survives expiration through the request proxy's refresh path.

The sign-in buttons remain disabled when configuration is missing. Provider names/photos do not independently verify project affiliation. Project relationships remain self-reported and approval-based.

## Stack

React, Vinext, Vite, Cloudflare Workers/D1, Supabase SSR Auth. Profiles, projects and collaboration data remain in D1. Authentication verifies the session with Supabase server-side and does not trust incoming ChatGPT identity headers.

## Reference documentation

- https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/auth/social-login/auth-twitter
