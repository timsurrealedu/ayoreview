# Security Notes

## Threat model (V1 pilot)

- Merchants (authenticated JWTs) hitting Supabase REST directly with the public anon/authenticated keys — **not** just through the app UI.
- Anonymous visitors with the anon key (it ships in `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- The service-role key never leaves the server (server routes / `dbRepo` only).

## Current posture (after migration 005)

| Surface | Control |
|---|---|
| Platform-admin flag | No UPDATE policy on `users`; column-level REVOKE (`is_platform_admin`) from anon/authenticated; `prevent_admin_self_escalation` trigger. Grant via SQL console or `ADMIN_EMAILS` env only. |
| Anon table access | RLS default-deny everywhere — no anon policies remain. Redirects resolve via service-role in the Next.js route, never the browser. |
| Blank inventory cards | Org-scoped RLS; unassigned cards readable/writable only by platform admin / service role. |
| Tenant isolation in app code | Route-level ownership pre-checks + `dbRepo` org-scoped lookups (`get*ById(id, orgId)`), `updateLocation`/`updateCard` enforce `orgId` internally. |

## Known limitations — deliberate, revisit triggers listed

1. **Service-role client used for all app queries** (`dbRepo` → `getAdminClient()`). Service role bypasses RLS, so tenant isolation rests entirely on app-level checks above; RLS currently only defends direct PostgREST access.
   *Revisit when:* onboarding non-pilot customers or adding org-scoped writes beyond current routes.
   *Fix:* user-scoped Supabase client (cookie session) for merchant routes; keep service role for `/q`, `/n`, platform admin, and system tasks. RLS policies from 002/005 are already written to support this.

2. **Rate limiting is per-instance** (`src/lib/rate-limiter.ts`). Best-effort abuse friction only — see the `honey:` note there.
   *Revisit when:* anything billable or security-relevant depends on it.
   *Fix:* Upstash Redis (`@upstash/ratelimit`, edge-compatible for middleware).

3. **`getCards({ orgId })` fetches all cards then filters in JS** — with org filter applied post-join. Correct, just unbounded at scale.
   *Revisit when:* card count makes dashboard latency noticeable.

## Granting platform admin

```sql
-- SQL console (runs as postgres; the escalation trigger allows non-PostgREST connections)
UPDATE public.users SET is_platform_admin = TRUE WHERE email = 'admin@example.com';
```
or set `ADMIN_EMAILS=admin@example.com` (checked at runtime in `src/lib/auth.ts`).
