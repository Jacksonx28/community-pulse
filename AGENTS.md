# Community Pulse development

The live application is https://joincommunitypulse.app/ and is deployed from the Jacksonx28/community-pulse GitHub main branch to Cloudflare Workers.

## Preview before release

The user wants updates reviewed in the existing private demo before they reach the live application. Keep that demo available for this workflow.

- Demo: https://community-pulse-ui-review.israeljackson854.chatgpt.site/
- Sites project ID: `appgprj_6ae403f2c4c081919311514a3227c22e`
- Demo source, when present in the workspace: `/workspace/sites/community-pulse-ui-review`

For user-facing updates, implement and validate the changes in the demo first, publish that same private Site, and explain where to review them. Promote the reviewed changes to the live application when the user has authorized release. Honor authorization already given in the conversation; do not request it again. A request for a demo alone does not authorize a production release.

The demo uses fictional profiles and browser-local saves. Preserve its private audience. Reuse its project ID and source repository, rather than creating another preview Site. Never copy `preview/`, fixture data, the demo API adapter, or its static hosting manifest into the production app.

## Existing source and verification

Check the current remote main before preparing a release. Existing workspaces may have a stale Git base and changes that are already live. Preserve unrelated work and push only the intended files. Never force-push or reset a dirty checkout to prepare a release.

Run TypeScript, the existing app/auth/onboarding checks and the production build for relevant changes. Validate the actual UI on desktop and mobile when browser access is available. Do not create test profiles or requests in the live database for a UI check. Never rerun the prelaunch database cleanup as part of a normal deployment.
