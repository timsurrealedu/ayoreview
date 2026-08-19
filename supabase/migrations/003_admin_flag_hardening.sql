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
