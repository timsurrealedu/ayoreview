# ReviewTap Pivot Plan — Pre-Programmed Card + Subscription

Based on conversation: instead of merchant signing up, configuring details, then buying a card → sell them a pre-made NFC+QR card, they scan/tap to set up, Google listing is auto-discovered, card is permanently linked, monthly subscription.

---

## Assumptions (Decided)

- **Data model**: Flat. Card stores `place_id` + `business_name` directly. No Org/Business/Location hierarchy needed for the core flow. Existing tables stay untouched for backward compatibility.
- **Google Places**: Build it — Google Places API text search. Merchant types name + city, we search Places API, they pick, we store `place_id` and construct the review URL dynamically at redirect time.
- **Card state**: Unlinked card (`/q/:publicId` has no `place_id`) redirects to `/s/:publicId` setup page.
- **Card encoding**: Card encodes `/q/:publicId` (both NFC and QR point here). The `/n/` distinction is dropped for pre-pro cards or kept as an alias.

---

## Phase 1: Schema & Data Layer

Add new columns to `cards` table and create `dbRepo` methods for the setup flow.

- **Migration `006_card_setup_flow.sql`** — Add to `cards`:
  ```sql
  ALTER TABLE cards ADD COLUMN place_id TEXT;
  ALTER TABLE cards ADD COLUMN business_name TEXT;
  ALTER TABLE cards ADD COLUMN merchant_email TEXT;
  ALTER TABLE cards ADD COLUMN subscription_status TEXT DEFAULT 'pending';
  ALTER TABLE cards ADD COLUMN subscription_id TEXT;
  ALTER TABLE cards ADD COLUMN linked_at TIMESTAMPTZ;
  CREATE INDEX IF NOT EXISTS idx_cards_place_id ON cards(place_id);
  ```
- **Update `src/lib/types.ts`** — Add new types: `CardSetupState` (pending | configured | active | suspended | cancelled), `SetupCard` (Card + the new fields), extend `Card` type with optional new fields.
- **Add to `src/lib/db.ts`** in `dbRepo`:
  - `setupLinkCard(cardId, placeId, businessName, merchantEmail)` — sets `place_id`, `business_name`, `merchant_email`, `linked_at`, `subscription_status = 'pending'`
  - `setupUpdateSubscription(cardId, subscriptionId, status)` — updates subscription fields
  - `setupGetCardByPublicId(publicId)` — returns card with all new fields (similar to existing `getCardByPublicId` but returns flat fields instead of joined location data)
  - `setupSearchCardsByEmail(email)` — find all cards linked to a merchant email (for dashboard)

**Acceptance criteria:**
- Migration runs cleanly against existing data (existing cards get NULLs in new columns, no breakage)
- All new `dbRepo` methods read/write correctly
- Existing card queries still work (backward compat)

---

## Phase 2: Google Places Integration

New module that searches Google Places API and resolves place IDs to review URLs.

- **Create `src/lib/places.ts`**:
  ```typescript
  // searchPlaces(query: string, city?: string) → Place[]
  // getPlaceDetails(placeId: string) → PlaceDetail
  // buildReviewUrl(placeId: string) → string (constructs writereview URL)
  ```
  - Uses Google Places API (New) with `GOOGLE_PLACES_API_KEY` env var
  - `searchPlaces` calls Places API text search (`Text Search (New)`)
  - `buildReviewUrl` returns `https://search.google.com/local/writereview?placeid=${placeId}`
  - Include a fallback: if `getPlaceDetails` returns a `googleMapsUri`, also support that as a secondary URL construction
- **Add `GOOGLE_PLACES_API_KEY` to `.env.example`** and the middleware config section

**Acceptance criteria:**
- `searchPlaces("Kopi Contoh", "Jakarta")` returns an array of place matches with name, address, place_id
- `buildReviewUrl("ChIJ...")` returns a valid `https://search.google.com/local/writereview?placeid=...` URL
- All functions handle API errors gracefully (timeout, quota exceeded, no results)

---

## Phase 3: Setup Route (`/s/:publicId`)

The new customer-facing setup flow. This is the core of the pivot — merchant scans the card and lands here.

- **Create `src/app/s/[publicId]/page.tsx`** — a `'use client'` page with steps:
  1. **Welcome** — "You've scanned a ReviewTap card. Let's link it to your business."
  2. **Business search** — Input for business name + city. On submit, calls `POST /api/setup/search` (see below).
  3. **Pick listing** — Shows results from Places API as a list. Merchant taps the right one.
  4. **Create account** — Email + password or Google OAuth (reuse existing Supabase auth components).
  5. **Payment** — Stripe Checkout or Setup Intent for the monthly subscription.
  6. **Done** — "Your card is live! Dashboard →"

- **Create `src/app/api/setup/search/route.ts`** — POST endpoint:
  - Accepts `{ query, city }`
  - Calls `searchPlaces()` from the places module
  - Returns matches
  - Rate-limited (10 req/min per IP — reuses existing `strictLimiter`)

- **Create `src/app/api/setup/link/route.ts`** — POST endpoint:
  - Accepts `{ publicId, placeId, businessName, email, password (or OAuth token) }`
  - Creates user via Supabase Auth if not existing
  - Calls `dbRepo.setupLinkCard()`
  - Returns success + redirect URL to dashboard
  - Authenticated (user must be logged in after account creation)

**Acceptance criteria:**
- Opening `/s/aBc1234` (unlinked card) shows the setup wizard
- Merchant can search for their business, pick a listing, and complete setup
- After setup, the card's `place_id` is stored in the database
- `/q/:publicId` now redirects to Google with the constructed URL (tested in Phase 4)

---

## Phase 4: Redirect Engine Update

Modify the existing redirect handlers to use the new flat model and handle unlinked cards.

- **Update `src/app/q/[publicId]/route.ts`**:
  - Call `dbRepo.setupGetCardByPublicId()` instead of `dbRepo.getCardByPublicId()`
  - If card has no `place_id` → redirect to `/s/${publicId}` (setup page)
  - If `subscription_status` is `suspended` or `cancelled` → redirect to `/fallback/inactive` (or a new "subscription required" fallback)
  - If card has `place_id` → call `buildReviewUrl(placeId)` → validate URL → 302 redirect
  - Bot filtering, IP hashing, async interaction recording remain the same
  - Record `source: 'qr'` or `source: 'nfc'` based on which route was hit

- **Update `src/app/n/[publicId]/route.ts`** — same logic, just records `source: 'nfc'`

- **Update `src/app/r/[publicId]/route.ts`** — already redirects to `/q/`, no change needed

- **Remove or update `/fallback/unconfigured`** — it's now replaced by the `/s/` setup redirect. The fallback page can stay for edge cases (e.g., card has `place_id` but it's somehow invalid).

**Acceptance criteria:**
- Tapping an unlinked card → setup page (`/s/:publicId`)
- Tapping a linked, active card → Google Review page (< 1s)
- Tapping a card with suspended subscription → appropriate fallback
- All existing analytics (bot filter, device type, IP hash, async logging) still work

---

## Phase 5: Stripe Subscription Integration

The billing layer.

- **Add Stripe dependencies**: `stripe` (server SDK)
- **Create `src/lib/stripe.ts`**:
  - `createCheckoutSession(cardId, priceId)` — creates Stripe Checkout session for monthly subscription
  - `handleWebhook(event)` — handles `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
  - On webhook events, call `dbRepo.setupUpdateSubscription()` to update card state
- **Create `src/app/api/stripe/webhook/route.ts`** — POST endpoint for Stripe webhooks
- **Create `src/app/api/stripe/create-checkout/route.ts`** — POST endpoint called from the setup wizard
- **Add env vars**: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Subscription status mapping**:

  | Stripe status | Card subscription_status |
  |---|---|
  | `incomplete` / `trialing` | `pending` |
  | `active` | `active` |
  | `past_due` | `past_due` (grace period) |
  | `canceled` / `unpaid` | `suspended` → after grace → `cancelled` |

- **Grace period logic** in the redirect handler: if `subscription_status` is `past_due` and within 30 days of `linked_at`, still redirect; after 30 days, show fallback.

**Acceptance criteria:**
- Setup wizard → Stripe Checkout → subscription created → card activated
- Stripe webhook updates card subscription status in DB
- Subscription cancellation → card redirect stops working after grace period
- Renewal works (webhook updates status)

---

## Phase 6: Merchant Dashboard (Flat Model)

A lightweight dashboard for the new flow. The merchant only has 1-5 cards — no complex org hierarchy needed.

- **Create `src/app/my/` routes** (new namespace, separate from existing `/dashboard`):
  - `src/app/my/page.tsx` — Shows the merchant's card(s): name, link status, interaction stats, subscription status
  - `src/app/my/cards/[id]/page.tsx` — Single card detail: QR preview (for reference), basic analytics, subscription management
  - `src/app/my/billing/page.tsx` — Subscription details, cancel button, invoice history
- **Shared layout**: `src/app/my/layout.tsx` — Simple sidebar with "My Cards", "Billing", "Settings"
- **Auth guard**: middleware already protects `/my` routes (add `/my/:path*` to the middleware matcher)
- **Analytics**: reuse `dbRepo.getAnalyticsOverview()` but scoped to a card's interactions instead of an org's. Add `dbRepo.setupGetCardAnalytics(cardId)` that returns today/7d/30d/all-time for a single card.

**Acceptance criteria:**
- After setup, merchant is redirected to `/my` dashboard
- Dashboard shows the card with basic stats (today, 7d, 30d taps/scans)
- Merchant can see subscription status and manage billing
- Existing `/dashboard` routes remain untouched (for the operator/admin use case)

---

## Phase 7 (Optional): Operator Admin — Pre-Pro Card Batch Generation

Update the admin portal to support the new card lifecycle.

- **Update `src/app/admin/cards/page.tsx`**:
  - Add "Pre-pro cards" tab showing cards with `subscription_status = 'pending'` and no `place_id`
  - Show batch generation button (already exists via `/api/admin/batch-generate`)
  - Show card setup status: "Shipped" → "Scanned" (first `/s/` visit) → "Linked" (setup complete) → "Active" (subscription active)
- **Update `POST /api/admin/batch-generate`** — allow specifying `card_type: 'pre_pro'` which generates cards with the new defaults (no location, status = 'active', ready for setup flow)

**Acceptance criteria:**
- Admin can generate 100 pre-pro cards with a single click
- Each card has a unique `public_id` and `inventory_code`
- Cards appear in the inventory with status "pending setup"

---

## Implementation Order

Phases are designed to be built in order — each depends on the previous:

```
Phase 1 (Schema) → Phase 2 (Places API) → Phase 3 (Setup Route) → Phase 4 (Redirect) → Phase 5 (Stripe) → Phase 6 (Dashboard) → Phase 7 (Admin, optional)
```

---

## What Stays the Same

- **Landing page** (`/`) — unchanged, still the marketing page
- **Login/Signup** (`/login`, `/signup`) — still work, used by the setup flow
- **Middleware** — still rate-limits and protects routes; add `/s/:path*` and `/my/:path*` to the matcher
- **Existing dashboard** (`/dashboard/*`) — untouched, still works for operator/admin use
- **Sentry, bot filter, IP hashing, rate limiter** — all reused as-is
- **Admin portal** (`/admin/*`) — still works for inventory management

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Google Places API quota/costs | Use generous free tier initially, add caching layer if needed (session or 1-day cache on place searches) |
| Place ID changes or removal | Google Place IDs are stable. If one becomes invalid, merchant can re-link via support |
| NFC tags on pre-pro cards can't be updated | Not a problem — NFC encodes `/q/:publicId` which is server-side configurable. The redirect engine is the source of truth |
| Stripe integration complexity | Use Stripe Checkout (hosted page) rather than building a custom payment form. Minimal PCI scope |
| Merchant doesn't finish setup after scanning | Card keeps redirecting to `/s/:publicId`. No time pressure. Add email reminder if they provided email but didn't complete payment |
| Existing users with the old hierarchy | Leave the old schema untouched. New cards use the flat model. Both models coexist in the `cards` table via nullable columns |
