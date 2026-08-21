# ReviewTap — Architecture Graph

Generated from full source analysis. Shows how every piece fits together.

---

## 1. Overall System Architecture

```
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                      NEXT.JS 15 APPLICATION                            │
  │                                                                         │
  │  ┌─────────────┐  ┌─────────────────────┐  ┌────────────────────────┐  │
  │  │  Landing    │  │  Merchant Dashboard │  │  Operator Admin        │  │
  │  │  (Public)   │  │  (Auth Required)    │  │  (Auth + Admin)        │  │
  │  │             │  │                     │  │                        │  │
  │  │  /          │  │  /dashboard/*       │  │  /admin/*              │  │
  │  │  /login     │  │  /onboarding        │  │                        │  │
  │  │  /signup    │  │                     │  │                        │  │
  │  └──────┬──────┘  └────────┬────────────┘  └───────────┬────────────┘  │
  │         │                  │                           │               │
  │         └────────┬─────────┴──────────────┬────────────┘               │
  │                  │                        │                            │
  │         ┌────────▼────────┐    ┌──────────▼───────────┐               │
  │         │  Middleware      │    │  API Routes          │               │
  │         │  (rate-limit +   │    │  /api/*              │               │
  │         │  session guard)  │    │                      │               │
  │         └────────┬────────┘    └──────────┬───────────┘               │
  │                  │                        │                            │
  │         ┌────────▼────────────────────────▼───────────┐               │
  │         │          PUBLIC REDIRECT ENGINE              │               │
  │         │                                              │               │
  │         │  GET /q/:publicId  (QR scan, records qr)    │               │
  │         │  GET /n/:publicId  (NFC tap, records nfc)   │               │
  │         │  GET /r/:publicId  (universal, to /q/:id)   │               │
  │         │                                              │               │
  │         │  1. Lookup card by public_id                │               │
  │         │  2. Validate card + location status         │               │
  │         │  3. Validate destination (Google URL)       │               │
  │         │  4. Check bot UA + detect device type       │               │
  │         │  5. Hash visitor IP                         │               │
  │         │  6. Record interaction (async via after)    │               │
  │         │  7. 302 redirect to Google Review URL       │               │
  │         └─────────────────────┬───────────────────────┘               │
  │                               │                                        │
  └───────────────────────────────┼────────────────────────────────────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │  Google Review       │
                       │  Destination URL     │
                       └─────────────────────┘
```

---

## 2. Data Model Hierarchy

```
Organization (e.g. "Timothy Hospitality Group")
  plan: pilot | starter | business | enterprise
  status: trial | active | past_due | suspended | cancelled
  │
  ├── OrganizationMember
  │     role: owner | admin | member
  │
  └── Business (e.g. "Kopi Contoh")
        category: string
        │
        └── Location (e.g. "Kemanggisan Flagship")
              address, city, country
              google_review_url (the actual destination)
              google_maps_url
              status: active | inactive
              │
              └── Card (e.g. "Kasir 01 - RT-000101")
                    public_id: nanoid(7)  -- encoded in QR/NFC
                    inventory_code: RT-XXXXXX
                    placement: cashier|table|entrance|counter|...
                    status: active|inactive|lost|replaced
                    │
                    └── Interaction
                          source: qr | nfc | direct
                          is_bot: 0|1
                          device_type: mobile|desktop|tablet|unknown
                          ip_hash: HMAC-SHA256
                          timestamp
```

---

## 3. Route Map

```
PUBLIC (Unauthenticated)
  /                        Landing page
  /fallback/not-found      Card not found
  /fallback/inactive       Card/location inactive
  /fallback/unconfigured   No Google URL set
  /routing-demo            Landing page demo component

QR/NFC Redirect (Unauthenticated)
  GET /q/:publicId         QR scan, record qr, 302 to Google
  GET /n/:publicId         NFC tap, record nfc, 302 to Google
  GET /r/:publicId         Universal, 307 to /q/:publicId

Auth (Mixed)
  /login                   Email/password + Google OAuth
  /signup                  Registration
  /auth/callback           OAuth code exchange

Onboarding (Auth Required)
  /onboarding              5-step wizard (biz + location + card)

Merchant Dashboard (Auth Required)
  /dashboard               Overview KPIs + trend chart + top cards
  /dashboard/locations     List all locations
  /dashboard/locations/:id Location detail + cards
  /dashboard/cards         List all cards (CRUD)
  /dashboard/cards/:id     Card detail/edit
  /dashboard/cards/:id/print Print-ready acrylic stand template
  /dashboard/analytics     Full analytics page
  /dashboard/settings      Account settings
  /dashboard/billing       Plan and billing

Admin Portal (Auth + Platform Admin)
  /admin                   System overview KPIs
  /admin/cards             Hardware inventory management
  /admin/organizations     Organization management
  /admin/users             User list

API Routes (Auth Required)
  GET|POST   /api/businesses
  GET|POST   /api/locations
  PATCH      /api/locations
  GET|POST   /api/cards
  GET|PATCH  /api/cards/:id
  GET        /api/analytics
  POST       /api/admin/batch-generate
  POST       /api/admin/assign
  POST       /api/auth/signout
```

---

## 4. Authentication Flow

```
                    ┌──────────────┐
                    │  Supabase    │
                    │  Auth        │
                    └──────┬───────┘
                           │
     ┌─────────────────────┼──────────────────────┐
     │                     │                      │
     ▼                     ▼                      ▼
┌──────────┐       ┌──────────────┐      ┌──────────────┐
│Middleware │       │  Server      │      │  Client      │
│(Edge)     │       │  Components  │      │  Components  │
│           │       │              │      │              │
│ Read      │       │ createClient │      │ createClient │
│ cookies   │       │ (server)     │      │ (browser)    │
│           │       │              │      │              │
│ updateSession│    │ getUser()    │      │ signInWith-  │
│           │       │              │      │ Password()   │
│ protect   │       │ requireUser()│      │ signInWith-  │
│ /dashboard│       │ requireOrg-  │      │ OAuth()      │
│ /admin    │       │ Membership() │      │              │
│ /onboarding│      │              │      │              │
│           │       │ checkOrgApi- │      │              │
│ redirect  │       │ Access()     │      │              │
│ /login    │       │              │      │              │
└──────────┘       └──────────────┘      └──────────────┘

Auth Methods: Email + Password, Google OAuth (via Supabase)
Session: Supabase SSR cookie pattern (middleware refreshes)

Org Resolution (requireOrgMembership):
  1. Get current user from Supabase
  2. Look up user's organizations from DB
  3. If none, auto-create org "{name}'s Venue"
  4. Return { user, org, role }

Platform Admin:
  is_platform_admin boolean on users table
  Also matched against ADMIN_EMAILS env var
  requirePlatformAdmin() enforces in admin routes
```

---

## 5. Redirect Pipeline (Core Feature)

```
Customer taps NFC or scans QR
              │
              ▼
   ┌────────────────────────┐
   │  GET /q/:publicId     │  or /n/:publicId
   │  (or /n/:publicId)    │
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ 1. Lookup Card        │  dbRepo.getCardByPublicId(publicId)
   │    by public_id       │  SELECT * FROM cards WHERE public_id = ?
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ 2. Validate State     │  card.status = active
   │                       │  location.status = active
   │                       │  google_review_url is set
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ 3. Validate URL       │  validateGoogleReviewUrl(destination)
   │                       │  Must be https:// + google host
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ 4. Analyze Request    │  isBotUserAgent(userAgent) -> 0|1
   │                       │  detectDeviceType(ua) -> mobile|...
   │                       │  hashIp(ip) -> HMAC-SHA256
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ 5. Record Async       │  after(async () => {
   │    (if not test)      │    dbRepo.recordInteraction({...})
   │                       │  })
   └────────┬───────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ 6. 302 Redirect       │  NextResponse.redirect(sanitizedUrl, 302)
   │    to Google          │
   └────────────────────────┘
            │
            ▼
   ┌────────────────────────┐
   │ Google Review Page    │  Customer sees star selector
   └────────────────────────┘

Key design choices:
  /q/ and /n/ differ only in source recorded (qr vs nfc)
  ?test=true skips interaction recording (gated by auth session)
  Bot detection prevents analytics inflation from link previews
  URL validation enforced at creation time AND redirect time
  after() keeps Vercel lambda alive for DB write
```

---

## 6. Library Layer (src/lib/)

```
src/lib/
  db.ts                 CENTRAL HUB (19 edges in graph)
    dbRepo              All database operations via Supabase admin client
      User and Org       get/create/update users, orgs, members
      Business           CRUD with org-scoping
      Location           CRUD with URL validation + org-scoping
      Card               CRUD, getByPublicId, getByInventoryCode, replace
      Interaction        record + analytics queries
      Admin              batchGenerate, systemOverview, getAllInventory

  types.ts              All TypeScript type definitions
    User, Organization, Business, Location
    Card, CardPlacement, CardStatus, CardWithStats
    Interaction, InteractionSource, DeviceType
    AnalyticsOverview, DailyTrendPoint, LocationWithStats

  auth.ts               Authentication and authorization
    getCurrentUser()         -> { id, email, name, is_platform_admin }
    requireUser()           -> redirect /login if not authenticated
    requireOrgMembership()  -> resolves org + role
    requirePlatformAdmin()  -> admin gate
    checkOrgApiAccess()     -> API route guard (merchant)
    checkAdminApiAccess()   -> API route guard (admin)

  supabase/
    server.ts            createClient() for server components
    client.ts            createClient() for browser components
    middleware.ts        updateSession() for Next.js middleware
    admin.ts             getAdminClient() with service_role key

  bot-filter.ts         Bot detection + device detection + IP hashing
    isBotUserAgent()        regex match against 23 bot patterns
    detectDeviceType()      mobile | desktop | tablet | unknown
    hashIp()                HMAC-SHA256 (keyed, stable)

  url-validator.ts      Strict Google URL validation
    validateGoogleReviewUrl()  only google.com/g.page/etc.
    validateGoogleMapsUrl()    only maps.google.com/goo.gl

  rate-limiter.ts       In-memory sliding-window rate limiter
    strictLimiter  10 req/min (login/signup)
    mediumLimiter  20 req/min (card creation)
    defaultLimiter 60 req/min (general API)

  qr.ts                 QR code generation via qrcode library
    generateQrPngDataUrl()  high-DPI PNG data URL
    generateQrSvgString()   SVG string

  api-helpers.ts        Shared API utilities
    handleApiError()        Sentry + generic message
    validateInventoryCode() RT-XXXXXX format
    validatePlacement()     enum check

  session-check.ts      isAuthenticatedRequest() for redirect test mode
```

---

## 7. Component Tree

```
RootLayout (Archivo + IBM Plex Mono fonts, dark theme)
  Landing Page (src/app/page.tsx)
    LandingPage()         Hero, How It Works, Product sections
    ReviewCard            Product photo component
    ReviewStars           5-star visual

  Auth Pages
    LoginPage
      LoginForm()         Email/password + Google OAuth
    SignupPage

  Onboarding
    OnboardingPage        5-step wizard
      QrPreviewModal()    Final step QR + download

  DashboardLayout
    DashboardSidebar()    Navigation, org badge, logout
    DashboardHeader()     Sticky top bar
    DashboardOverview
      KPI Cards           today, 7d, 30d, all-time
      TrendChart          30-day area chart (Recharts)
      SourceSplitCard     QR vs NFC bar + stats
      TopCardsTable       Top 5 cards table
    CardsList             Full card list with search/filter
    CardDetail            Edit card form + QR preview
    PrintTemplate         Print-ready acrylic stand (10x15cm)
    Locations/LocationDetail

  AdminLayout
    AdminOverview         System KPIs
    AdminCards            Inventory management
    AdminOrganizations
    AdminUsers

  Fallback Pages
    not-found, inactive, unconfigured
```

---

## 8. Database Schema

```
8 tables in PostgreSQL via Supabase:

users              id, email, name, is_platform_admin, timestamps
organizations      id, name, owner_user_id, plan, status, timestamps
organization_members id, org_id, user_id, role, timestamps
businesses         id, org_id, name, category, logo_url, timestamps, archived_at
locations          id, business_id, name, address, city, country, google_maps_url,
                   google_review_url, status, timestamps
cards              id, location_id, public_id (unique), inventory_code (unique),
                   name, placement, status, timestamps
interactions       id, card_id, source, timestamp, is_bot, user_agent, ip_hash,
                   device_type
subscriptions      id, org_id, plan, status, starts_at, expires_at, timestamps

Indexes: cards.public_id, cards.inventory_code, interactions(card_id, timestamp),
         interactions.timestamp, locations.business_id, businesses.org_id,
         org_members(user_id, org_id)
```

---

## 9. Key Design Decisions

1. **Redirect Architecture** — Cards encode `reviewtap.id/q/:publicId` not the Google
   URL itself. Merchants change the destination in the dashboard and all physical
   cards update instantly with no reprint needed.

2. **Service Role Client** — All DB queries use the Supabase service_role key (admin
   client), bypassing RLS. Tenant isolation is enforced in application code via
   org-scoping on every query instead.

3. **Async Interaction Logging** — Uses Next.js `after()` (waitUntil semantics) so the
   302 redirect is not delayed by the DB write. Vercel keeps the lambda alive until
   the insert completes.

4. **Bot Filtering** — 23 regex patterns detect crawlers/social preview bots.
   Analytics only count non-bot interactions.

5. **IP Hashing** — HMAC-SHA256 with a configurable secret. Reversible only with the
   secret. Falls back to "anonymous" if the secret is missing in production.

6. **Per-Instance Rate Limiting** — In-memory Map, not Redis. Documented as best-effort
   abuse friction at pilot scale. Separate tiers for login (10/min), card creation
   (20/min), and general (60/min).

7. **URL Validation** — Enforced at both creation time (when merchant enters the
   Google URL) and at redirect time (before the 302 is issued). Only https:// URLs
   on allowed Google hosts.

8. **Org Auto-Creation** — If a user has no organization, one is created automatically
   on first dashboard visit. This removes a friction point from the signup flow.

9. **NFC and QR as Separate Paths** — `/q/` and `/n/` are distinct route handlers that
   differ only in the `source` field recorded on the interaction. `/r/` is a universal
   handler that redirects to `/q/`.

10. **Sentry Error Tracking** — All API handlers and redirect routes are wrapped with
    Sentry capture. Generic error messages are returned to the client; real details go
    to Sentry.

---

## 10. God Nodes (from graphify-out analysis)

The existing graphify run identified the most connected abstractions:

| Rank | Node | Edges | Role |
|------|------|-------|------|
| 1 | `dbRepo` | 19 | Central DB abstraction, everything goes through it |
| 2 | `checkOrgApiAccess()` | 18 | Auth gate for every API route |
| 3 | `compilerOptions` | 16 | TS config (artifact, not code) |
| 4 | `handleApiError()` | 14 | Error handling for all API routes |
| 5 | `requireOrgMembership()` | 13 | Auth + org resolution for pages |
| 6 | Redirect endpoints | 13 | The core product feature |
| 7 | `requirePlatformAdmin()` | 10 | Admin gate |
| 8 | `DashboardHeader()` | 9 | Shared header component |
| 9 | `validateGoogleReviewUrl()` | 9 | Security validation |
| 10 | `ReviewTap (Product)` | 9 | The product itself |

---

## 11. Graph Communities (from graphify-out)

The codebase naturally clusters into 36 communities. Key ones:

| Community | Focus | Cohesion |
|-----------|-------|----------|
| 0 | Dashboard pages + components | 0.08 |
| 1 | Admin portal pages | 0.09 |
| 2 | PRD requirements + features | 0.06 |
| 3-5 | Config, deps, build tooling | 0.07-0.09 |
| 6 | API route handlers | 0.24 |
| 7 | Bot filter + URL validation | 0.22 |
| 8 | Rate limiter + middleware | 0.22 |
| 9 | Security (RLS, migrations) | 0.20 |
| 10 | Database tables | 0.44 |
| 11 | Auth triggers | 0.25 |
| 12 | Dashboard sidebar/layout | 0.29 |
| 13 | Login/signup | 0.48 |

**Notable:** Communities 0-2 have low cohesion (<0.09), meaning the dashboard pages and
PRD requirements are loosely coupled — good for independent iteration. Communities 10
(DB schema) and 13 (auth forms) are tightly cohesive.

---

## 12. Data Flow for a Typical Merchant Action

```
Merchant creates a new card:
  1. Client (browser) fetches /api/cards (POST)
  2. Middleware checks rate limit + refreshes session
  3. API route calls checkOrgApiAccess()
     -> getCurrentUser() -> Supabase auth.getUser()
     -> dbRepo.getUserOrganizations() -> DB query
  4. Validates request body (name, placement, inventory_code)
  5. Verifies location belongs to org
  6. dbRepo.createCard()
     -> generates id (crd_xxx), public_id (nanoid), inventory_code
     -> INSERT into cards table via Supabase admin client
  7. Returns { success: true, data: card }
  8. Client shows the new card + QR preview

Customer scans QR:
  1. GET /q/:publicId
  2. Middleware: rate limit check (passes through)
  3. dbRepo.getCardByPublicId() -> DB lookup by index
  4. Validate status + location + URL
  5. Bot check + device detection + IP hash
  6. after() -> dbRepo.recordInteraction() (async DB insert)
  7. 302 redirect to Google Review URL
  8. Customer sees Google review page (sub-1s total)
```
