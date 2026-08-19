-- ReviewTap full schema bootstrap (migrations 001-005 combined, in order)
-- Paste into: Supabase Dashboard -> SQL Editor -> New query -> Run
-- Safe on a FRESH project. On an existing project run the numbered files individually instead.

-- ==============================================================
-- 001_initial_schema.sql
-- ==============================================================
-- ReviewTap PostgreSQL / Supabase Schema V1.1
-- Compliant with PRD Section 13 & Productionization Sprint

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    is_platform_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'pilot', -- pilot, starter, business, enterprise
    status TEXT NOT NULL DEFAULT 'active', -- trial, active, past_due, suspended, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Organization Memberships Table
CREATE TABLE IF NOT EXISTS public.organization_members (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'owner', -- owner, admin, member
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- 4. Businesses Table
CREATE TABLE IF NOT EXISTS public.businesses (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    archived_at TIMESTAMPTZ
);

-- 5. Locations Table
CREATE TABLE IF NOT EXISTS public.locations (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    google_maps_url TEXT,
    google_review_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- active, inactive
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Cards Table
CREATE TABLE IF NOT EXISTS public.cards (
    id TEXT PRIMARY KEY,
    location_id TEXT REFERENCES public.locations(id) ON DELETE SET NULL,
    public_id TEXT UNIQUE NOT NULL,
    inventory_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    placement TEXT NOT NULL DEFAULT 'cashier', -- cashier, table, entrance, counter, receipt, waiting_area, custom
    status TEXT NOT NULL DEFAULT 'active', -- active, inactive, lost, replaced
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Interactions Table
CREATE TABLE IF NOT EXISTS public.interactions (
    id TEXT PRIMARY KEY,
    card_id TEXT NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
    source TEXT NOT NULL, -- qr, nfc, direct
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    is_bot INTEGER NOT NULL DEFAULT 0,
    user_agent TEXT,
    ip_hash TEXT,
    device_type TEXT -- mobile, desktop, tablet, unknown
);

-- 8. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'pilot',
    status TEXT NOT NULL DEFAULT 'active',
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for ultra-fast query and redirect lookup (<300ms p95)
CREATE INDEX IF NOT EXISTS idx_cards_public_id ON public.cards(public_id);
CREATE INDEX IF NOT EXISTS idx_cards_location ON public.cards(location_id);
CREATE INDEX IF NOT EXISTS idx_cards_inventory ON public.cards(inventory_code);
CREATE INDEX IF NOT EXISTS idx_interactions_card_time ON public.interactions(card_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_interactions_timestamp ON public.interactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_locations_business ON public.locations(business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_org ON public.businesses(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);

-- ==============================================================
-- 002_rls_and_auth_triggers.sql
-- ==============================================================
-- ReviewTap RLS & Auth Synchronization

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is platform admin
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()::text AND is_platform_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has access to organization
CREATE OR REPLACE FUNCTION public.user_has_org_access(org_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id AND user_id = auth.uid()::text
  ) OR public.is_platform_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users RLS
CREATE POLICY "Users can view own profile or admins view all"
ON public.users FOR SELECT
USING (id = auth.uid()::text OR public.is_platform_admin());

CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (id = auth.uid()::text);

-- Organizations RLS
CREATE POLICY "Members can view their organizations"
ON public.organizations FOR SELECT
USING (public.user_has_org_access(id));

CREATE POLICY "Owners and admins can update organizations"
ON public.organizations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = organizations.id 
      AND user_id = auth.uid()::text 
      AND role IN ('owner', 'admin')
  ) OR public.is_platform_admin()
);

-- Organization Members RLS
CREATE POLICY "Members can view org members"
ON public.organization_members FOR SELECT
USING (public.user_has_org_access(organization_id));

-- Businesses RLS
CREATE POLICY "Members can access businesses"
ON public.businesses FOR ALL
USING (public.user_has_org_access(organization_id));

-- Locations RLS
CREATE POLICY "Members can access locations"
ON public.locations FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = locations.business_id 
      AND public.user_has_org_access(b.organization_id)
  )
);

-- Cards RLS
CREATE POLICY "Members can manage cards"
ON public.cards FOR ALL
USING (
  location_id IS NULL OR EXISTS (
    SELECT 1 FROM public.locations l
    JOIN public.businesses b ON l.business_id = b.id
    WHERE l.id = cards.location_id 
      AND public.user_has_org_access(b.organization_id)
  ) OR public.is_platform_admin()
);

-- Public Fast Lookup Policy for Cards & Locations (Fast 302 Redirects)
CREATE POLICY "Public read for cards by public_id"
ON public.cards FOR SELECT
USING (true);

CREATE POLICY "Public read for locations"
ON public.locations FOR SELECT
USING (true);

CREATE POLICY "Public insert for interactions"
ON public.interactions FOR INSERT
WITH CHECK (true);

-- Auth user creation sync trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id TEXT;
  org_name TEXT;
  raw_name TEXT;
BEGIN
  raw_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  org_name := COALESCE(NEW.raw_user_meta_data->>'organization_name', raw_name || '''s Organization');

  -- Insert into public.users
  INSERT INTO public.users (id, email, name, is_platform_admin, created_at, updated_at)
  VALUES (
    NEW.id::text,
    NEW.email,
    raw_name,
    COALESCE((NEW.raw_user_meta_data->>'is_platform_admin')::boolean, false),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = NOW();

  -- Auto-create initial organization if user doesn't have one
  new_org_id := 'org_' || substr(md5(random()::text || clock_timestamp()::text), 1, 10);
  
  INSERT INTO public.organizations (id, name, owner_user_id, plan, status, created_at, updated_at)
  VALUES (new_org_id, org_name, NEW.id::text, 'pilot', 'active', NOW(), NOW());

  INSERT INTO public.organization_members (id, organization_id, user_id, role, created_at)
  VALUES ('mem_' || substr(md5(random()::text || clock_timestamp()::text), 1, 10), new_org_id, NEW.id::text, 'owner', NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================
-- 003_admin_flag_hardening.sql
-- ==============================================================
-- ReviewTap Admin Flag Hardening
-- Prevents privilege escalation via client-controlled is_platform_admin in signup metadata.
--
-- The handle_new_user() trigger previously read is_platform_admin from
-- raw_user_meta_data (set by the signup caller, including anon-key callers).
-- This migration hard-codes is_platform_admin = FALSE on self-signup.
--
-- Platform admins must be granted via one of:
--   1. ADMIN_EMAILS environment variable (checked at runtime in src/lib/auth.ts)
--   2. Manual SQL: UPDATE public.users SET is_platform_admin = TRUE WHERE email = 'admin@example.com';

-- Replace the trigger function to never trust client-controlled metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id TEXT;
  org_name TEXT;
  raw_name TEXT;
BEGIN
  raw_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  org_name := COALESCE(NEW.raw_user_meta_data->>'organization_name', raw_name || '''s Organization');

  -- Insert into public.users — is_platform_admin is ALWAYS false on self-signup
  INSERT INTO public.users (id, email, name, is_platform_admin, created_at, updated_at)
  VALUES (
    NEW.id::text,
    NEW.email,
    raw_name,
    FALSE,  -- HARDENED: never trust client-supplied is_platform_admin
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = NOW();

  -- Auto-create initial organization if user doesn't have one
  new_org_id := 'org_' || substr(md5(random()::text || clock_timestamp()::text), 1, 10);

  INSERT INTO public.organizations (id, name, owner_user_id, plan, status, created_at, updated_at)
  VALUES (new_org_id, org_name, NEW.id::text, 'pilot', 'active', NOW(), NOW());

  INSERT INTO public.organization_members (id, organization_id, user_id, role, created_at)
  VALUES ('mem_' || substr(md5(random()::text || clock_timestamp()::text), 1, 10), new_org_id, NEW.id::text, 'owner', NOW());

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Scrubbing: revoke any existing admin flags that were self-granted via signup.
-- This runs AFTER the trigger replacement so no new tainted rows come in.
-- WARNING: manually-promoted platform admins (via SQL) will also be reset to false.
-- They must be re-promoted via ADMIN_EMAILS or manual UPDATE after this migration.
UPDATE public.users SET is_platform_admin = FALSE WHERE is_platform_admin = TRUE;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Creates user profile and organization on auth signup. is_platform_admin is hardcoded FALSE; use ADMIN_EMAILS env or manual SQL to grant platform access.';

-- ==============================================================
-- 004_rls_tightening.sql
-- ==============================================================
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

-- ==============================================================
-- 005_rls_escalation_and_anon_hardening.sql
-- ==============================================================
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

