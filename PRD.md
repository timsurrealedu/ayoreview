
# PRD — Smart Review Card Platform V1

## 1. Product Overview

### Product Name

Working title: **ReviewTap**

The final brand name can change later. Throughout this PRD, the product is referred to as **ReviewTap**.

### Product Type

B2B SaaS + physical NFC/QR product for local businesses.

### V1 Objective

Build the smallest commercially viable platform that allows a business to:

1. Register an account.
2. Add one or more business locations.
3. Configure a Google Review destination.
4. Generate unique QR/NFC redirect links.
5. Associate physical review cards with locations.
6. Track card interactions.
7. View basic analytics.
8. Change the review destination without reprinting the physical card.
9. Allow the platform operator to manage businesses, subscriptions, cards, and support issues.

V1 should be strong enough to install in **real restaurants, cafés, salons, clinics, barbershops, retail stores, and similar businesses**.

The goal of V1 is **not** to become a complete reputation-management platform.

The goal is to validate that businesses will:

* use the product,
* keep the physical cards deployed,
* care about interaction analytics,
* and eventually pay for it.

---

# 2. Problem Statement

Customers often intend to leave a Google review but do not because the process introduces friction.

Current typical flow:

1. Unlock phone.
2. Open Google Maps or Google Search.
3. Search for the business.
4. Find the correct listing.
5. Open the listing.
6. Scroll to the review section.
7. Select "Write a review."
8. Choose a rating.
9. Write the review.
10. Submit.

Every additional step decreases the probability that the customer completes the review.

Businesses therefore have a problem:

> Customers who are willing to leave feedback often never actually submit a review because the process is inconvenient.

Businesses currently solve this using:

* printed QR codes,
* verbal reminders,
* Google review links,
* table signs,
* receipt messages,
* NFC stickers,
* WhatsApp messages.

These approaches are usually fragmented and provide little or no analytics.

ReviewTap simplifies the interaction to:

```text
Tap NFC
or
Scan QR

↓

Google review page
```

while providing businesses with a management and analytics layer behind the physical card.

---

# 3. Product Vision

Long-term vision:

> Become the customer-engagement infrastructure connecting physical businesses with their digital customer touchpoints.

Google Reviews is the initial wedge.

Future potential destinations could include:

* Google Reviews
* Instagram
* WhatsApp
* menus
* promotions
* loyalty programs
* customer surveys
* feedback forms
* membership programs
* social media
* reservations
* CRM
* customer support

However, **none of these except Google Reviews belong in V1.**

---

# 4. Core Product Principle

The QR code and NFC tag must never directly encode the Google Review URL.

Instead, both encode a ReviewTap-owned redirect URL.

Example:

```text
https://reviewtap.id/r/a7Xk29
```

The flow becomes:

```text
Customer
   ↓
NFC tap / QR scan
   ↓
ReviewTap redirect endpoint
   ↓
Interaction recorded
   ↓
HTTP redirect
   ↓
Google Review page
```

This creates several advantages:

* destination can be changed remotely,
* physical card never needs reprogramming,
* QR never needs reprinting,
* interactions can be measured,
* cards can be disabled,
* individual cards can be tracked,
* cards can be reassigned,
* future destinations can be supported,
* businesses become dependent on the software rather than the NFC hardware.

This redirect architecture is one of the most important V1 requirements.

---

# 5. V1 Success Definition

V1 is successful if the platform can support:

### Technical validation

At least:

* 100 businesses
* 500 business locations
* 5,000 physical cards
* 100,000 monthly redirect events

without major architecture changes.

These are not expected launch numbers.

They are simply the minimum scale the architecture should comfortably support.

### Commercial validation

Within the first pilot:

* at least 5 businesses deploy cards,
* at least 70% keep cards deployed for 30 days,
* at least 100 real customer interactions occur,
* at least 3 businesses regularly check analytics,
* at least 1 business expresses willingness to pay.

### User-experience validation

The customer interaction should feel almost instant.

Target:

```text
NFC/QR
   ↓
ReviewTap
   ↓
Google

< 1 second added latency
```

The customer should ideally never perceive ReviewTap as an intermediate website.

---

# 6. Target Users

## Primary User: Small Business Owner

Examples:

* café owner
* restaurant owner
* barber
* salon owner
* dentist
* clinic
* repair shop
* boutique
* gym
* photography studio

Characteristics:

* may not be technically knowledgeable,
* often manages business through phone,
* wants more Google reviews,
* does not care how NFC technically works,
* expects setup to be easy,
* cares more about measurable results than software complexity.

Primary need:

> "Make it easier for my customers to review my business."

---

## Secondary User: Business Manager

Examples:

* restaurant manager,
* operations manager,
* marketing employee,
* social media manager.

Primary need:

> "Show me how many customers are interacting with the review cards."

---

## Future User: Multi-Location Operator

Examples:

* franchise owner,
* restaurant chain,
* salon chain,
* retail group.

Primary need:

> "Which locations and placements generate the most engagement?"

V1 should support this data structure even if sophisticated chain-management features are deferred.

---

## Internal User: ReviewTap Administrator

The platform operator needs to:

* create businesses manually,
* troubleshoot accounts,
* inspect cards,
* assign/reassign cards,
* modify destinations,
* deactivate cards,
* inspect interactions,
* manage subscriptions,
* support pilot customers.

A minimal internal admin interface is required.

---

# 7. User Journey

## Business Owner Journey

### Step 1 — Registration

User opens:

```text
reviewtap.id/signup
```

User enters:

* full name
* email
* password

Optional later:

* Google login

V1 recommendation:

Support:

* email
* password

Google OAuth is nice to have but not mandatory for initial pilot.

---

### Step 2 — Create Business

User is prompted:

> Add your business

Fields:

* business name
* business category
* country
* city

Example:

```text
Business name:
Kopi Contoh

Category:
Cafe

Country:
Indonesia

City:
Jakarta
```

---

### Step 3 — Create Location

Fields:

* location name
* address
* Google Maps URL
* Google Review URL

Example:

```text
Business:
Kopi Contoh

Location:
Kemanggisan

Address:
Jl. Example No. 12

Google Maps:
https://maps.google.com/...

Google Review Link:
https://g.page/r/.../review
```

For V1, the user manually provides the Google Review URL.

Do not spend significant engineering resources automatically discovering Google listings yet.

---

### Step 4 — Generate Review Link

System generates:

```text
reviewtap.id/r/aB92Kx
```

Destination:

```text
Google Review URL
```

The system verifies:

* URL exists syntactically,
* URL uses HTTPS,
* destination belongs to an allowed domain.

---

### Step 5 — Create Card

Business clicks:

> Add Card

Fields:

* card name
* location
* placement type

Example:

```text
Card name:
Kasir 01

Location:
Kemanggisan

Placement:
Cashier
```

Available placement categories:

* cashier
* table
* entrance
* counter
* receipt
* waiting area
* custom

---

### Step 6 — Card Link Generated

Each card receives two tracking links.

Example:

QR:

```text
reviewtap.id/q/X8W91K
```

NFC:

```text
reviewtap.id/n/X8W91K
```

Both redirect to the same Google destination.

Difference:

```text
/q/
```

records:

```text
source = QR
```

while:

```text
/n/
```

records:

```text
source = NFC
```

---

### Step 7 — Generate QR

System automatically generates a QR image.

User can:

* preview QR,
* download PNG,
* download SVG.

Physical ReviewTap cards produced internally will use the same QR.

---

### Step 8 — Program NFC

For operator-manufactured cards:

The NFC tag is programmed with:

```text
https://reviewtap.id/n/X8W91K
```

NFC programming itself happens outside the SaaS application during V1.

No NFC-writing functionality needs to exist inside the dashboard.

---

### Step 9 — Customer Interaction

Customer scans:

```text
reviewtap.id/q/X8W91K
```

Backend:

1. validates card,
2. records interaction,
3. determines destination,
4. sends HTTP redirect.

Example event:

```json
{
  "card_id": "X8W91K",
  "source": "qr",
  "timestamp": "2026-08-18T14:20:21Z"
}
```

---

### Step 10 — Dashboard

Business sees:

```text
Kopi Contoh — Kemanggisan

Review Page Visits

Today
18

Last 7 Days
143

Last 30 Days
621

QR
412

NFC
209
```

---

# 8. Functional Requirements

# FR-001 Authentication

Users must be able to:

* register,
* login,
* logout,
* reset forgotten password.

Authentication should be session-based or token-based using established authentication infrastructure.

Recommended:

Supabase Auth or equivalent.

---

# FR-002 Account Structure

Data hierarchy:

```text
User
 ↓
Organization
 ↓
Business
 ↓
Location
 ↓
Card
 ↓
Interaction
```

Even if V1 users typically own a single business, introducing an **Organization** layer prevents future restructuring.

Example:

```text
Organization
Timothy Hospitality Group

Businesses
├── Kopi Contoh
└── Noodle Contoh

Locations
├── Kopi Contoh Kemanggisan
├── Kopi Contoh PIK
└── Noodle Contoh Grogol
```

---

# FR-003 Organization

Each new user creates or belongs to an organization.

Organization fields:

```text
id
name
owner_user_id
plan
status
created_at
updated_at
```

Status options:

```text
trial
active
past_due
suspended
cancelled
```

Subscription payments do not need full automation initially.

Admin should be able to manually change plan/status.

---

# FR-004 Business Management

Users can:

* create business,
* edit business,
* archive business.

Business fields:

```text
id
organization_id
name
category
logo_url
created_at
updated_at
archived_at
```

Deletion should be soft deletion.

---

# FR-005 Location Management

Each business can contain multiple locations.

Fields:

```text
id
business_id
name
address
city
country
google_maps_url
google_review_url
status
created_at
updated_at
```

Status:

```text
active
inactive
```

---

# FR-006 Review Destination Management

Each location has a destination URL.

The merchant can modify the destination.

Changing the destination must immediately affect all cards attached to that location.

Example:

Before:

```text
Card A
   ↓
Location 1
   ↓
Google URL A
```

Merchant changes location URL.

After:

```text
Card A
   ↓
Location 1
   ↓
Google URL B
```

Physical card remains untouched.

---

# FR-007 Cards

Every physical or digital review card has a corresponding database entity.

Fields:

```text
id
location_id
public_id
name
placement
status
created_at
updated_at
```

Example:

```text
public_id:
X8W91K
```

Must not expose sequential database IDs.

Use random secure IDs such as:

* NanoID
* UUID-derived slug

Suggested public ID length:

6–10 characters.

---

# FR-008 Card Status

Cards support:

```text
active
inactive
lost
replaced
```

If card status is:

```text
active
```

redirect normally.

If:

```text
inactive
lost
replaced
```

redirect to ReviewTap fallback page.

Example:

> This ReviewTap card is currently inactive.

Never expose internal configuration.

---

# FR-009 Redirect Endpoint

Required endpoints:

```text
GET /q/:publicId
GET /n/:publicId
```

QR:

```text
/q/X8W91K
```

NFC:

```text
/n/X8W91K
```

Server process:

```text
Request
 ↓
Lookup card
 ↓
Validate card status
 ↓
Resolve location
 ↓
Resolve review URL
 ↓
Log interaction
 ↓
302 redirect
```

The redirect must remain fast even if analytics logging fails.

Priority:

```text
Redirect customer
>
Record analytics
```

Logging failure should never prevent the customer reaching Google.

---

# FR-010 Interaction Tracking

For every valid interaction, store:

```text
id
card_id
source
timestamp
```

Optional metadata:

```text
user_agent
referrer
ip_hash
country
device_type
```

Do not store unnecessary personally identifying data.

V1 minimum:

```text
card_id
source
timestamp
```

Recommended:

```text
device_type
```

if implementation is easy.

---

# FR-011 Basic Bot Filtering

Analytics should attempt to ignore obvious non-human requests such as:

* crawler requests,
* monitoring services,
* link preview bots.

Each event may contain:

```text
is_bot
```

Bot interactions should not appear in default merchant analytics.

Perfect bot detection is not required.

---

# FR-012 Analytics Dashboard

Dashboard metrics:

### Overview

```text
Today
Last 7 days
Last 30 days
All time
```

### Source split

```text
QR interactions
NFC interactions
```

### Trend graph

Daily interactions over:

```text
7 days
30 days
90 days
```

### Top cards

Example:

| Card       | Placement | Interactions |
| ---------- | --------- | -----------: |
| Cashier 01 | Cashier   |          483 |
| Table 03   | Table     |          127 |
| Table 02   | Table     |          109 |

### Locations

If multiple locations:

| Location    | Interactions |
| ----------- | -----------: |
| Kemanggisan |          621 |
| PIK         |          423 |
| Grogol      |          312 |

---

# FR-013 Analytics Terminology

Never label interactions as:

> Reviews generated

unless ReviewTap can prove that a review was submitted.

Use:

* Review Page Visits
* Review Interactions
* Card Interactions
* QR Scans
* NFC Taps

Primary metric:

> **Review Page Visits**

---

# FR-014 Card Detail Page

Each card page shows:

```text
Card:
Cashier 01

Status:
Active

Location:
Kemanggisan

Placement:
Cashier

QR Link:
reviewtap.id/q/X8W91K

NFC Link:
reviewtap.id/n/X8W91K
```

Analytics:

```text
Today
7 days
30 days
All time
```

Actions:

```text
Download QR
Rename Card
Change Placement
Deactivate Card
```

---

# FR-015 QR Generator

QR codes must:

* contain redirect URL,
* support SVG,
* support PNG,
* have sufficient error correction,
* remain scannable when printed.

Default QR URL:

```text
https://reviewtap.id/q/{publicId}
```

The application should display:

> Test QR

before download.

---

# FR-016 Merchant Dashboard Navigation

Recommended layout:

```text
ReviewTap

Overview

Businesses
Locations
Cards
Analytics

Account
Billing
```

For V1:

```text
Billing
```

may simply display current plan without automated payment.

---

# FR-017 Onboarding

First login should launch onboarding.

Progress:

```text
1. Add your business
2. Add your location
3. Add Google Review link
4. Create your first card
5. Test your card
```

Show completion state:

```text
✓ Business
✓ Location
✓ Review link
✓ Card
✓ Test
```

After completion:

> Your ReviewTap setup is ready.

---

# FR-018 Test Card Function

Merchant should be able to press:

> Test Review Link

which opens the merchant's redirect link.

The interaction should optionally be excluded from analytics.

Recommended parameter:

```text
?test=true
```

or separate internal endpoint.

---

# FR-019 Admin Dashboard

Internal admin dashboard requires:

### Organizations

View:

* organization
* owner
* plan
* status
* business count
* card count

### Businesses

View all businesses.

### Locations

View:

* destination URL
* status
* card count

### Cards

Search by:

* card ID
* business
* location

Actions:

* activate
* deactivate
* reassign
* replace

### Users

View:

* email
* organization
* registration date
* status

### Analytics

System-wide:

* total interactions
* interactions today
* active cards
* active businesses

---

# FR-020 Manual Card Assignment

This is particularly important during pilots.

Admin should be able to create physical cards ahead of time.

Example:

```text
Physical Inventory

RT-000001
RT-000002
RT-000003
```

Admin can assign:

```text
RT-000001
→ Kopi Contoh
→ Kemanggisan
→ Cashier
```

This dramatically simplifies deployment.

---

# FR-021 Card Inventory Code

Each physical card should have a small printed inventory code.

Example:

```text
RT-A7X29
```

This is separate from customer-facing branding.

Purpose:

* identify card during support,
* track inventory,
* replace damaged cards,
* reassign cards.

---

# FR-022 Card Replacement

Admin can mark:

```text
Card A
status = replaced
```

and assign:

```text
Card B
```

to the same location.

Historical analytics for Card A remain available.

---

# 9. Physical Product Specification

V1 physical product should be intentionally simple.

## Recommended Format

Acrylic stand approximately:

```text
8–12 cm wide
10–15 cm tall
```

Alternative:

PVC card.

For restaurants, acrylic is preferable because it:

* remains visible,
* stands upright,
* feels more premium,
* is harder to lose,
* provides room for branding.

---

# 10. Card Design

Recommended copy:

```text
★★★★★

Enjoyed your visit?

Tap or scan to
leave us a review

[NFC ICON]

[QR CODE]

Business Logo
```

Do not say:

> Give us 5 stars

because the system should request genuine reviews without directing sentiment.

---

# 11. NFC Specification

Recommended chip:

**NTAG213**

Why:

* inexpensive,
* broadly compatible,
* sufficient memory,
* suitable for URL storage.

Each NFC tag contains:

```text
https://reviewtap.id/n/{publicId}
```

After programming:

* verify NFC scan,
* verify redirect,
* optionally lock tag against modification.

---

# 12. QR Specification

QR should encode:

```text
https://reviewtap.id/q/{publicId}
```

Recommended:

* high contrast,
* white quiet zone,
* minimum printed size approximately 25–30 mm,
* no excessive logo obstruction.

---

# 13. Database Design

Suggested PostgreSQL schema.

## users

Authentication provider may own this table.

```sql
id
email
name
created_at
```

---

## organizations

```sql
id
name
owner_user_id
plan
status
created_at
updated_at
```

---

## organization_members

```sql
id
organization_id
user_id
role
created_at
```

Roles:

```text
owner
admin
member
```

V1 may only expose owner functionality while maintaining this structure.

---

## businesses

```sql
id
organization_id
name
category
logo_url
created_at
updated_at
archived_at
```

---

## locations

```sql
id
business_id
name
address
city
country
google_maps_url
google_review_url
status
created_at
updated_at
```

---

## cards

```sql
id
location_id
public_id
inventory_code
name
placement
status
created_at
updated_at
```

Indexes:

```sql
UNIQUE(public_id)
UNIQUE(inventory_code)
INDEX(location_id)
```

---

## interactions

```sql
id
card_id
source
timestamp
is_bot
user_agent
ip_hash
```

Indexes:

```sql
INDEX(card_id)
INDEX(timestamp)
INDEX(card_id, timestamp)
```

Potential future scale can move events into an analytics datastore.

Not required for V1.

---

## subscription

```sql
id
organization_id
plan
status
starts_at
expires_at
created_at
updated_at
```

Payments can remain manual initially.

---

# 14. API Design

Example backend API.

## Authentication

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
```

If using Supabase/Clerk, provider handles these.

---

## Business

```text
GET    /api/businesses
POST   /api/businesses
GET    /api/businesses/:id
PATCH  /api/businesses/:id
DELETE /api/businesses/:id
```

---

## Locations

```text
GET    /api/locations
POST   /api/locations
GET    /api/locations/:id
PATCH  /api/locations/:id
```

---

## Cards

```text
GET    /api/cards
POST   /api/cards
GET    /api/cards/:id
PATCH  /api/cards/:id
```

---

## Analytics

```text
GET /api/analytics/overview
GET /api/analytics/cards
GET /api/analytics/locations
```

Parameters:

```text
from
to
business
location
card
```

---

# 15. Redirect Architecture

Redirect endpoint should be optimized separately from the dashboard.

Example:

```text
GET /q/X8W91K
```

Pseudo logic:

```text
lookup card using public ID

if missing:
    return inactive page

if status != active:
    return inactive page

destination = card.location.google_review_url

queue analytics event

return 302 destination
```

Avoid:

```text
await analytics insert
then redirect
```

if it creates noticeable latency.

Preferred:

```text
resolve
log asynchronously / fire-and-forget where platform permits
redirect
```

---

# 16. Recommended Tech Stack

## Frontend

**Next.js**

Advantages:

* single full-stack project,
* mature ecosystem,
* Vercel compatibility,
* easy dashboards,
* server-side routing.

---

## Styling

Recommended:

* Tailwind CSS
* shadcn/ui

---

## Database

**PostgreSQL**

Recommended managed provider:

**Supabase**

Provides:

* PostgreSQL
* authentication
* row-level security
* storage
* APIs

---

## Hosting

**Vercel**

V1 architecture:

```text
Vercel
├── Dashboard
├── API
└── Redirect endpoints

Supabase
├── PostgreSQL
├── Auth
└── Storage
```

---

## QR

Potential package:

```text
qrcode
```

or equivalent server/client QR library.

QR generation must not rely on an external third-party service.

---

# 17. Security Requirements

## SR-001 Authorization

Users can only access organizations they belong to.

---

## SR-002 Object Authorization

Every request for:

```text
business
location
card
analytics
```

must validate organization membership.

Never trust frontend identifiers.

---

## SR-003 Public Redirect Endpoint

Public redirect endpoints must expose no private merchant information.

---

## SR-004 Destination Validation

Only approved URL schemes:

```text
https://
```

Avoid allowing:

```text
javascript:
file:
data:
```

---

## SR-005 Open Redirect Protection

Do not allow redirect URL through query parameters.

Bad:

```text
/r?id=X&redirect=https://evil.com
```

Destination must always come from server-side database configuration.

---

## SR-006 Rate Limiting

Implement basic rate limits on:

* login,
* signup,
* card creation,
* redirect endpoints if abuse occurs.

Redirect rate limiting must not affect legitimate high-volume business usage.

---

## SR-007 Password Security

Delegated to trusted authentication provider.

---

# 18. Privacy Requirements

ReviewTap should minimize collection of end-customer information.

V1 should not collect:

* customer name,
* Google identity,
* email,
* phone,
* review content.

Analytics are primarily anonymous interaction events.

IP address, if used for abuse detection, should preferably be:

* hashed,
* truncated,
* or discarded after processing.

---

# 19. Analytics Requirements

## Main Metrics

Dashboard:

```text
Review Page Visits

Today
7 Days
30 Days
All Time
```

---

## Breakdown

By:

```text
source
location
card
placement
day
```

---

## Chart

Default:

30-day daily line chart.

Example:

```text
Interactions

60 ┤           ╭╮
50 ┤       ╭───╯╰╮
40 ┤   ╭───╯      ╰╮
30 ┤───╯            ╰──
20 ┤
   └────────────────────
```

---

# 20. Dashboard Pages

V1 requires approximately these routes:

```text
/login
/signup

/onboarding

/dashboard
/dashboard/businesses
/dashboard/businesses/:id

/dashboard/locations
/dashboard/locations/:id

/dashboard/cards
/dashboard/cards/:id

/dashboard/analytics

/dashboard/settings
/dashboard/billing

/admin
/admin/organizations
/admin/cards
/admin/users
```

---

# 21. Dashboard Home

Example:

```text
Good afternoon, Timothy

Kopi Contoh

Review Page Visits

Today
24
↑ 20%

Last 7 Days
183

Last 30 Days
721

──────────────

Interactions

[30 DAY CHART]

──────────────

QR vs NFC

QR          67%
NFC         33%

──────────────

Top Cards

Cashier     184
Table 04     91
Table 02     82
```

---

# 22. Empty States

Good empty states matter significantly.

Example:

## No business

> Add your first business to start collecting customer interactions.

Button:

```text
Add Business
```

---

## No card

> Create a ReviewTap card to start directing customers to your Google Review page.

Button:

```text
Create Card
```

---

## No interactions

> Your card is active. Interactions will appear here when customers tap or scan it.

---

# 23. Merchant Setup Validation

Before a card can activate:

System should confirm:

```text
✓ Business exists
✓ Location exists
✓ Google Review URL configured
✓ Card assigned
```

If destination missing:

```text
Card status:
Setup incomplete
```

---

# 24. Error States

## Invalid Card

Customer-facing:

> This ReviewTap link is not available.

Do not expose technical details.

---

## Missing Destination

Customer-facing fallback:

> This business's review link is temporarily unavailable.

Internally notify admin.

---

## Database Failure

If destination is cached:

redirect using cached destination.

This can be added later if necessary.

---

# 25. Billing Model

V1 does not require automated billing.

Support plans in database:

```text
pilot
starter
business
enterprise
```

Admin manually changes plan.

Potential future:

```text
Starter
Rp49k/mo

Business
Rp149k/mo

Enterprise
Custom
```

Physical card cost can be charged separately.

---

# 26. Plan Limits

Design support for:

```text
business_limit
location_limit
card_limit
retention_days
```

Example:

### Pilot

```text
Businesses: 1
Locations: 1
Cards: 5
```

### Starter

```text
Businesses: 1
Locations: 2
Cards: 10
```

### Business

```text
Businesses: 5
Locations: 10
Cards: 100
```

Do not necessarily enforce sophisticated billing limits during pilot.

---

# 27. Physical Inventory Workflow

Admin receives:

```text
100 blank NFC tags
100 acrylic stands
```

System generates inventory:

```text
RT00001
RT00002
...
RT00100
```

Each has unique public ID.

Example:

```text
Inventory:
RT00021

Public:
K9X2QM
```

QR:

```text
reviewtap.id/q/K9X2QM
```

NFC:

```text
reviewtap.id/n/K9X2QM
```

When customer purchases:

```text
Assign RT00021
→ Business
→ Location
→ Placement
```

No need to regenerate hardware.

---

# 28. Pilot Deployment Workflow

For first customers:

### Before visit

Create:

* merchant organization,
* business,
* location,
* cards.

---

### At business

Install:

* 1 cashier card,
* 1 entrance card,
* optionally table cards.

Verify:

* QR,
* NFC,
* Google destination.

---

### Record placement

Example:

```text
Card RT00014

Business:
Bakmi ABC

Location:
Kemanggisan

Placement:
Cashier
```

---

### After 7 Days

Review:

```text
Card interactions
QR vs NFC
best placement
```

---

### After 30 Days

Interview merchant:

* Did staff mention the card?
* Did customers use it?
* Did Google review count change?
* Did they check dashboard?
* What feature did they expect?
* Would they pay?
* How much?

---

# 29. Product Analytics

ReviewTap itself should track:

### Merchant funnel

```text
Signup
↓
Business Created
↓
Location Created
↓
Destination Configured
↓
Card Created
↓
First Interaction
↓
10 Interactions
↓
100 Interactions
```

Critical activation event:

> **First real card interaction**

---

# 30. Internal Product Metrics

Track:

```text
Total organizations
Active organizations

Businesses
Locations

Cards deployed
Active cards

Interactions/day
Interactions/month

QR:NFC ratio

Average interactions/card
Average interactions/business
```

---

# 31. North Star Metric

Recommended V1 north-star metric:

> **Monthly Review Page Visits generated through active ReviewTap cards**

This measures whether the product is actually being used in the physical world.

---

# 32. Supporting Metrics

### Deployment Rate

```text
Cards with ≥1 interaction
÷
Cards activated
```

---

### Merchant Activation

```text
Businesses with ≥10 interactions
÷
Businesses onboarded
```

---

### Card Engagement

```text
Interactions
÷
Active cards
```

---

### Merchant Retention

```text
Businesses still active after 30/60/90 days
```

---

# 33. V1 Non-Goals

Do **not** build:

* AI review generation,
* AI review replies,
* review sentiment analysis,
* WhatsApp automation,
* CRM,
* loyalty program,
* custom landing pages,
* social media links,
* POS integration,
* Google Analytics integration,
* customer accounts,
* customer identity tracking,
* review scraping,
* public review monitoring,
* reputation score,
* franchise reporting suite,
* automatic Google Business Profile sync,
* Stripe subscription automation,
* mobile application,
* advanced staff roles,
* white-label platform,
* API for third-party developers.

Each creates scope creep before product-market validation.

---

# 34. UX Requirements

## Mobile First

Although merchants may use desktop, dashboard must function well on mobile.

Business owners frequently operate from phones.

---

## Setup Time

Target:

> New merchant can configure first digital card in under 3 minutes.

---

## Minimal Technical Language

Avoid UI terminology such as:

```text
Redirect endpoint
NDEF record
URI payload
HTTP response
```

Use:

```text
Review Link
Review Card
QR Code
NFC Tap
Card Activity
```

---

# 35. Performance Requirements

Redirect:

```text
p95 ReviewTap processing latency:
<300ms
```

excluding Google destination load time.

Dashboard:

```text
Initial page:
<2.5 seconds
```

Typical analytics query:

```text
<1 second
```

---

# 36. Reliability Requirements

Target V1 uptime:

```text
99.5%
```

Redirect system deserves higher priority than dashboard.

If dashboard is temporarily unavailable but cards redirect successfully, business impact remains low.

---

# 37. Logging

Server logs should capture:

* redirect errors,
* invalid destinations,
* authentication errors,
* database errors,
* card lookup failures.

Do not log secrets.

---

# 38. Observability

Minimum:

* Vercel logs
* error tracking

Recommended:

Sentry or similar.

Alert when:

```text
redirect error rate spikes
```

because redirect failure directly breaks physical products already deployed.

---

# 39. Feature Priorities

## P0 — Must Exist

* authentication
* organizations
* business creation
* locations
* destination URL
* cards
* QR/NFC links
* redirects
* interaction logging
* basic analytics
* QR download
* admin card management
* card status
* mobile-friendly UI

Without these, V1 is incomplete.

---

## P1 — Strongly Recommended

* onboarding wizard
* placement tracking
* organization members
* bot filtering
* CSV analytics export
* logo upload
* password reset
* manual subscription status

---

## P2 — Later

* automated billing
* Google OAuth
* Google Business API
* advanced analytics
* scheduled reports
* multi-user permission system
* automated card ordering.

---

# 40. Suggested Development Phases

## Phase 1 — Core Infrastructure

Build:

```text
Next.js
Supabase
Authentication
Organizations
Businesses
Locations
```

Exit condition:

merchant can register and configure Google review destination.

---

## Phase 2 — Redirect Engine

Build:

```text
Cards
Public IDs
QR routes
NFC routes
302 redirects
interaction records
```

Exit condition:

```text
scan QR
→ database event
→ Google
```

works reliably.

This is the most important technical milestone.

---

## Phase 3 — Dashboard

Build:

* interaction counters,
* source split,
* 30-day chart,
* card table,
* location table.

Exit condition:

business owner can understand card usage.

---

## Phase 4 — Physical Card System

Build:

* inventory codes,
* admin assignment,
* QR export,
* NFC programming workflow.

Produce:

```text
10–20 prototype cards
```

---

## Phase 5 — Admin

Build:

* organizations,
* businesses,
* cards,
* reassignment,
* activation/deactivation.

---

## Phase 6 — Pilot

Deploy to:

```text
3–5 businesses
```

Collect actual behavior.

Do not begin significant P2 development until pilot evidence exists.

---

# 41. Acceptance Criteria

V1 is ready for real-world pilot when all of the following work.

### Merchant

* [ ] User can register.
* [ ] User can login.
* [ ] User can create business.
* [ ] User can create location.
* [ ] User can provide Google Review URL.
* [ ] User can create card.
* [ ] User can download QR.
* [ ] User can rename card.
* [ ] User can deactivate card.
* [ ] User can see interactions.
* [ ] User can separate QR and NFC interactions.
* [ ] User can view analytics by card.
* [ ] User can view analytics by location.
* [ ] User can change review destination.

### Customer

* [ ] QR opens Google Review destination.
* [ ] NFC opens Google Review destination.
* [ ] Customer does not need to log into ReviewTap.
* [ ] Customer never sees dashboard.
* [ ] Redirect feels instantaneous.

### Admin

* [ ] Admin can view organizations.
* [ ] Admin can view locations.
* [ ] Admin can locate card using inventory ID.
* [ ] Admin can assign card.
* [ ] Admin can reassign card.
* [ ] Admin can disable card.
* [ ] Admin can inspect interaction counts.

### Physical

* [ ] NFC works on iPhone.
* [ ] NFC works on common Android devices.
* [ ] QR scans reliably.
* [ ] Printed QR remains readable.
* [ ] Individual card can be identified from inventory code.

---

# 42. Example End-to-End Scenario

Merchant:

```text
Bakmi Nusantara
```

Location:

```text
Kemanggisan
```

Google Review destination:

```text
https://g.page/r/example/review
```

Admin installs:

```text
RT00012 — Cashier
RT00013 — Entrance
RT00014 — Table 1
RT00015 — Table 2
```

Customer scans:

```text
reviewtap.id/q/A91KL2
```

ReviewTap records:

```text
card = RT00012
source = qr
time = 19:32
```

Customer receives:

```text
302
→ Google Review
```

Thirty days later:

```text
Bakmi Nusantara

Review Page Visits
1,292

QR
847

NFC
445

Top Placement

Cashier
623 interactions

Table
451 interactions

Entrance
218 interactions
```

Merchant discovers:

> Customer interaction is highest near the cashier.

That insight can influence where future cards are installed.

---

# 43. Suggested Repository Structure

```text
reviewtap/
│
├── app/
│   ├── dashboard/
│   ├── onboarding/
│   ├── admin/
│   ├── q/
│   └── n/
│
├── components/
│   ├── dashboard/
│   ├── cards/
│   ├── analytics/
│   └── ui/
│
├── lib/
│   ├── auth/
│   ├── database/
│   ├── analytics/
│   ├── redirects/
│   └── qr/
│
├── supabase/
│   ├── migrations/
│   └── seed/
│
└── public/
```

---

# 44. Suggested V1 Screens

The design effort should focus on approximately 12 key screens:

1. Landing page
2. Signup
3. Login
4. Onboarding — business
5. Onboarding — location
6. Onboarding — review destination
7. Dashboard overview
8. Locations list
9. Location detail
10. Cards list
11. Card detail
12. Admin cards view

You do not need dozens of pages.

---

# 45. Design Direction

The product should communicate:

* trust,
* simplicity,
* modern technology,
* hospitality,
* measurable results.

Avoid making it look like a developer tool.

The merchant is buying:

> more convenient customer feedback.

Not:

> programmable NFC infrastructure.

Dashboard aesthetic:

* clean,
* bright,
* generous spacing,
* large numbers,
* minimal navigation,
* charts used sparingly,
* strong mobile support.

---

# 46. Landing Page Positioning

Primary message:

> **Turn happy customers into Google reviews.**

Subheading:

> Customers simply tap or scan your ReviewTap card and go directly to your Google review page.

Primary CTA:

> Get ReviewTap

Secondary CTA:

> See how it works

Three-step explanation:

```text
1
Place ReviewTap

2
Customer taps or scans

3
They reach your Google review page
```

---

# 47. What V1 Is Really Testing

V1 should answer five questions.

## Question 1

Do customers actually scan or tap?

If not, the fundamental behavioral assumption is wrong.

---

## Question 2

Where should cards be placed?

Potential discovery:

```text
Cashier > Table > Entrance
```

or perhaps something completely different.

---

## Question 3

Does NFC matter?

Perhaps actual data shows:

```text
QR 85%
NFC 15%
```

That could materially change hardware strategy.

---

## Question 4

Do businesses care about analytics?

If owners never open the dashboard, analytics may not be the subscription driver.

---

## Question 5

Will businesses pay recurring fees?

This determines whether ReviewTap is:

```text
hardware business
```

or:

```text
hardware-enabled SaaS
```

The second outcome is far more attractive.

---

# 48. Decisions That Should Be Deferred Until After Pilot

Do not decide prematurely:

* final subscription pricing,
* enterprise pricing,
* whether NFC is mandatory,
* ideal card quantity,
* best card placement,
* whether businesses want monthly reports,
* whether analytics create retention,
* whether software should be subscription-based,
* whether to manufacture cards yourself,
* whether merchants install cards themselves,
* whether Google Reviews remains the primary destination.

The pilot exists specifically to answer these.

---

# 49. V1 Product Philosophy

Every engineering decision should be evaluated against:

> Does this help us install ReviewTap in real businesses and learn whether customers use it?

If no, it is probably not V1.

That means:

```text
Redirect reliability
> animation

Analytics accuracy
> visual complexity

Fast onboarding
> configuration flexibility

Physical deployment
> feature count

Real customer data
> hypothetical scalability
```

---

# 50. Final V1 Definition

ReviewTap V1 is complete when a real business owner can:

```text
Sign up
   ↓
Add their business
   ↓
Add a location
   ↓
Enter their Google Review URL
   ↓
Receive physical NFC + QR cards
   ↓
Place them in their business
   ↓
Customers tap or scan
   ↓
Customers reach Google Reviews
   ↓
Merchant sees interaction analytics
```

while ReviewTap internally can:

```text
identify every card
track every interaction
manage card assignments
change destinations remotely
support multiple locations
disable or replace cards
measure real-world usage
```

The **key V1 advantage is not NFC**.

It is:

> **A centrally managed physical-to-digital review infrastructure where every deployed touchpoint is dynamic and measurable.**

That foundation is sufficiently narrow to build quickly, but sufficiently extensible that it can later evolve into a much broader customer-engagement platform without rebuilding the core architecture.
