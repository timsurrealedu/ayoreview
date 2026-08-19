# Graph Report - reviewtap  (2026-08-19)

## Corpus Check
- 65 files · ~36,261 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 357 nodes · 578 edges · 36 communities (23 shown, 13 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.88)
- Token cost: 22,000 input · 7,500 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 25
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34

## God Nodes (most connected - your core abstractions)
1. `dbRepo` - 19 edges
2. `checkOrgApiAccess()` - 18 edges
3. `compilerOptions` - 16 edges
4. `handleApiError()` - 14 edges
5. `requireOrgMembership()` - 13 edges
6. `Redirect Endpoint (FR-009: GET /q/:publicId, GET /n/:publicId)` - 13 edges
7. `requirePlatformAdmin()` - 10 edges
8. `DashboardHeader()` - 9 edges
9. `validateGoogleReviewUrl()` - 9 edges
10. `ReviewTap (Product)` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Per-Instance Rate Limiter (src/lib/rate-limiter.ts)` --semantically_similar_to--> `Rate Limiting (SR-006)`  [INFERRED] [semantically similar]
  SECURITY.md → PRD.md
- `Tenant Isolation in App Code (Route-Level Ownership Pre-Checks)` --semantically_similar_to--> `Object Authorization (SR-002)`  [INFERRED] [semantically similar]
  SECURITY.md → PRD.md
- `GET /r/:publicId (Universal Redirect Handler)` --references--> `Redirect Endpoint (FR-009: GET /q/:publicId, GET /n/:publicId)`  [EXTRACTED]
  README.md → PRD.md
- `Service-Role Client for All App Queries (dbRepo getAdminClient)` --references--> `Ultra-Fast Sub-Second Redirect Engine`  [EXTRACTED]
  SECURITY.md → README.md
- `generateQrPngDataUrl()` --references--> `qrcode`  [EXTRACTED]
  src/lib/qr.ts → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Account Data Hierarchy (User-Organization-Business-Location-Card-Interaction)** — prd_organization, prd_business, prd_location, prd_card, prd_interaction [EXTRACTED 1.00]
- **Redirect Pipeline (Lookup-Validate-Resolve-Log-302)** — prd_redirect_endpoint, prd_card, prd_location, prd_interaction, prd_google_reviews [EXTRACTED 1.00]
- **Layered Tenant Isolation Posture (RLS + App-Level Checks + Admin Separation)** — security_rls_default_deny, security_tenant_isolation, security_platform_admin_flag, security_service_role_client [EXTRACTED 1.00]

## Communities (36 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (28): qrcode, qrcode, DashboardOverviewPage(), dynamic, DashboardHeader(), SourceSplitCard(), SourceSplitProps, TopCardsTable() (+20 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (30): AdminLayout(), dynamic, AdminOrganizationsPage(), dynamic, AdminOverviewPage(), dynamic, AdminUsersPage(), dynamic (+22 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (47): Admin Dashboard (FR-019), Analytics Dashboard (FR-012), Basic Bot Filtering (FR-011), Business (FR-004), Card (FR-007), Card Inventory Code (FR-021, RT-XXXXXX), Destination Validation (SR-004), Google Reviews (Destination) (+39 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (25): devDependencies, postcss, tailwindcss, @tailwindcss/postcss, @types/node, @types/qrcode, @types/react, @types/react-dom (+17 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (23): clsx, lucide-react, nanoid, dependencies, clsx, lucide-react, nanoid, next (+15 more)

### Community 6 - "Community 6"
Cohesion: 0.24
Nodes (15): GET(), GET(), POST(), GET(), PATCH(), GET(), POST(), GET() (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (13): dynamic, GET(), dynamic, GET(), BOT_PATTERNS, detectDeviceType(), hashIp(), isBotUserAgent() (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (7): defaultLimiter, mediumLimiter, RateLimiter, strictLimiter, updateSession(), config, middleware()

### Community 9 - "Community 9"
Cohesion: 0.20
Nodes (10): PostgreSQL (Database), Rate Limiting (SR-006), Supabase (Managed PostgreSQL + Auth), Migration 005 (Admin Separation), Security Notes (V1 Pilot), Platform-Admin Flag (is_platform_admin), prevent_admin_self_escalation Trigger, Per-Instance Rate Limiter (src/lib/rate-limiter.ts) (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.44
Nodes (8): public.businesses, public.cards, public.interactions, public.locations, public.organization_members, public.organizations, public.subscriptions, public.users

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (6): public.handle_new_user, public.organization_members, public.users, on_auth_user_created, public.is_platform_admin(), public.user_has_org_access()

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (6): DashboardLayout(), dynamic, adminNavItem, bottomNavItems, DashboardSidebar(), navItems

### Community 13 - "Community 13"
Cohesion: 0.48
Nodes (3): LoginForm(), SignupPage(), createClient()

### Community 14 - "Community 14"
Cohesion: 0.40
Nodes (4): buildCommand, cleanUrls, framework, headers

## Knowledge Gaps
- **92 isolated node(s):** `config`, `metadata`, `SourceSplitProps`, `QrPreviewProps`, `nextConfig` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Community 5` to `Community 0`, `Community 4`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `qrcode` connect `Community 0` to `Community 5`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `generateQrPngDataUrl()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `config`, `metadata`, `SourceSplitProps` to the rest of the system?**
  _92 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08081632653061224 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08953900709219859 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.061979648473635525 - nodes in this community are weakly interconnected._