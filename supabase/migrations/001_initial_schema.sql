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
