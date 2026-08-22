# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: merchant or venue owner managing Google-review acquisition at a physical business. Secondary: platform operators provisioning hardware, organizations, and users.

## Product Purpose

ReviewTap removes the friction between a satisfied in-store customer and the business's Google review form. Success means a customer can tap NFC or scan QR and reach the current review destination in under one second, while the merchant can manage that destination and measure interactions.

## Positioning

Physical cards contain a stable ReviewTap managed redirect rather than the final Google URL. A merchant can change the destination centrally without replacing or reprinting deployed cards.

## Operating Context

- Customers interact with physical NFC and QR cards at entrances, counters, cashiers, and tables.
- Merchants use dashboard and `/my` portals for onboarding, card setup, locations, billing, and analytics.
- Platform operators use the admin portal for inventory generation, assignment, replacement, organizations, and users.
- The hierarchy is Organization → Business → Location → Card → Interaction.

## Capabilities and Constraints

- Next.js 15, React 19, Supabase/PostgreSQL, Tailwind CSS v4, and Vercel.
- Supabase authentication; card and QR creation requires an account.
- Public redirect routes are unauthenticated and include bot filtering, device detection, IP hashing, and rate limiting.
- Merchant analytics include 30-day trends, QR/NFC source split, and placement performance.
- Card print output supports high-resolution QR assets and fixed physical print dimensions.
- Existing database, domain API, authentication contracts, route behavior, copy, data flows, and information architecture must remain stable unless explicitly changed.

## Brand Commitments

The product name is ReviewTap, with AyoReview retained in incumbent Indonesian product copy. The voice is confident, direct, and infrastructure-minded: a dependable utility rather than a gimmick. Existing approved product imagery and card references remain source assets.

## Evidence on Hand

- Product and architecture records: `PRD.md`, `ARCHITECTURE.md`, and `DESIGN.md`.
- Physical card reference: `public/images/review-card-reference.png`.
- Documentary placement imagery: `public/images/cashier.webp`, `countertop.webp`, `entrance.webp`, and `table.webp`.
- No approved customer testimonials, logos, or performance claims are recorded; future work must not fabricate them.

## Product Principles

1. Keep the physical card stable while making its destination operationally flexible.
2. Minimize customer effort between tap or scan and the Google review form.
3. Give merchants clear operational status and actionable interaction data.
4. Keep platform administration efficient without exposing internal complexity to merchants.
5. Treat reliability, accessibility, and safe recovery states as product behavior.

## Accessibility & Inclusion

All web surfaces target WCAG 2.2 AA, including keyboard operation, visible focus, semantic status communication, readable contrast, reduced-motion support, and layouts usable at 200% zoom.
