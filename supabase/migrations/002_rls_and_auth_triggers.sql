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
