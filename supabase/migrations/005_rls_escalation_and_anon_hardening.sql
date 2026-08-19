-- ReviewTap RLS Escalation & Anon Access Hardening
--
-- Fixes three holes left by 002-004:
--
-- 1. PLATFORM ADMIN SELF-ESCALATION (critical)
--    002's "Users can update own profile" policy (FOR UPDATE USING id = auth.uid())
--    is row-level only — Postgres RLS cannot restrict columns. Any authenticated
--    user could UPDATE their own row setting is_platform_admin = true, which
--    getCurrentUser() trusts for platform-admin access (cross-org data).
--    No application code updates public.users (dbRepo only SELECTs), so the
--    policy is dropped entirely. Layered defense:
--      a) policy dropped (no code path needs it)
--      b) column-level REVOKE on is_platform_admin for anon/authenticated —
--         survives a future permissive UPDATE policy being re-added
--      c) trigger rejects any change to is_platform_admin unless the caller is
--         service_role or a non-PostgREST connection (SQL editor / psql, where
--         auth.role() is NULL) — survives a future GRANT reset
--
-- 2. ANON CARDS TABLE DUMP (high)
--    004's "Anonymous card redirect lookup" was USING (true) — every row passes
--    and all columns are readable (RLS does not restrict columns). All app code
--    reads cards via the service-role client (getCardByPublicId in src/lib/db.ts),
--    so the policy serves no path. Dropped; anon gets zero rows (RLS default-deny).
--    004 also never applied (invalid WITH CHECK on a SELECT policy rolled the
--    whole migration back), so 002's public policies are dropped here too,
--    idempotently — this converges whether or not a fixed 004 ran first.
--
-- 3. BLANK-CARD INVENTORY EXPOSURE (high)
--    002's "Members can manage cards" had `location_id IS NULL OR ...`, letting
--    ANY authenticated user read and modify every unassigned operator-inventory
--    card (inventory codes, self-assignment). Replaced with org-scoped access;
--    platform admins retain full access, and app flows are unaffected (service
--    role bypasses RLS).
--
-- NOTE: local dev without SUPABASE_SERVICE_ROLE_KEY falls back to the anon key
-- (src/lib/supabase/admin.ts) — redirect lookups will 404 until the key is set.

BEGIN;

-- 1a. Drop the users UPDATE policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- 1b. Column-level privilege: only service_role / SQL console can write the flag
REVOKE INSERT (is_platform_admin), UPDATE (is_platform_admin)
  ON public.users FROM anon, authenticated;

-- 1c. Trigger backstop (allows service_role + direct SQL; blocks API roles)
CREATE OR REPLACE FUNCTION public.prevent_admin_self_escalation()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_platform_admin IS DISTINCT FROM OLD.is_platform_admin
     AND auth.role() NOT IN ('service_role')  -- NULL (direct SQL) passes
  THEN
    RAISE EXCEPTION 'is_platform_admin cannot be modified by role %', auth.role()
      USING HINT = 'Grant platform admin via SQL console or ADMIN_EMAILS env.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_users_admin_flag_change ON public.users;
CREATE TRIGGER on_users_admin_flag_change
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.prevent_admin_self_escalation();

-- 1d. Re-scrub: 003 scrubbed at its run time; anything set since (via the hole
--     being closed here) resets now. Legit admins use ADMIN_EMAILS (runtime
--     check in src/lib/auth.ts) and are unaffected.
UPDATE public.users SET is_platform_admin = FALSE WHERE is_platform_admin = TRUE;

-- 2. Remove anon access to cards entirely
DROP POLICY IF EXISTS "Anonymous card redirect lookup" ON public.cards;
DROP POLICY IF EXISTS "Public read for cards by public_id" ON public.cards;
DROP POLICY IF EXISTS "Public read for locations" ON public.locations;
DROP POLICY IF EXISTS "Public insert for interactions" ON public.interactions;

-- 3. Cards: org-scoped only — no blank-card escape hatch
DROP POLICY IF EXISTS "Members can manage cards" ON public.cards;
CREATE POLICY "Members can manage cards"
ON public.cards FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.locations l
    JOIN public.businesses b ON l.business_id = b.id
    WHERE l.id = cards.location_id
      AND public.user_has_org_access(b.organization_id)
  ) OR public.is_platform_admin()
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.locations l
    JOIN public.businesses b ON l.business_id = b.id
    WHERE l.id = cards.location_id
      AND public.user_has_org_access(b.organization_id)
  ) OR public.is_platform_admin()
);

COMMIT;

COMMENT ON POLICY "Members can manage cards" ON public.cards IS
  'Org members manage cards assigned to their org locations; blank (unassigned) cards are platform-admin/service-role only.';
