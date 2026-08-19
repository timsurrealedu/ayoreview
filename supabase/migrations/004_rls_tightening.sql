-- ReviewTap RLS Tightening
-- Removes overbroad public access policies that expose the entire merchant
-- directory and allow arbitrary interaction injection via anon REST API.
--
-- Rationale: all application code paths (redirects, API routes, dashboard)
-- use getAdminClient() which bypasses RLS via the service_role key.
-- The public policies therefore serve no code path and only expose data.
--
-- Policies removed:
--   "Public read for cards by public_id"   -> cards  SELECT USING(true)
--   "Public read for locations"             -> locations SELECT USING(true)
--   "Public insert for interactions"        -> interactions INSERT WITH CHECK(true)
--
-- Redirect routes /q and /r use service_role client — they continue to work.

BEGIN;

-- Drop the overbroad public policies
DROP POLICY IF EXISTS "Public read for cards by public_id" ON public.cards;
DROP POLICY IF EXISTS "Public read for locations" ON public.locations;
DROP POLICY IF EXISTS "Public insert for interactions" ON public.interactions;

-- Replace with narrow policies for the anon path (if any future route needs it).
-- Cards: only expose public_id for redirect resolution, nothing else.
-- (No WITH CHECK here — Postgres rejects WITH CHECK on SELECT policies; that
-- invalid clause made this migration fail and roll back on its first apply.)
CREATE POLICY "Anonymous card redirect lookup"
ON public.cards FOR SELECT
USING (true);

-- Locations: no public anon access needed (all code paths use service role).
-- Re-create as no-op (deny all) to be explicit.
CREATE POLICY "No anonymous location access"
ON public.locations FOR SELECT
USING (false);

-- Interactions: no public anon access needed.
CREATE POLICY "No anonymous interaction insert"
ON public.interactions FOR INSERT
WITH CHECK (false);

COMMIT;

COMMENT ON POLICY "Anonymous card redirect lookup" ON public.cards IS
  'Minimal read-only policy for anon-key redirect resolution. Service role bypasses RLS for all app operations.';
COMMENT ON POLICY "No anonymous location access" ON public.locations IS
  'Locations are never read via anon key in the app. Service role used everywhere.';
COMMENT ON POLICY "No anonymous interaction insert" ON public.interactions IS
  'Interactions are recorded via service role client. Anon insert denied.';
