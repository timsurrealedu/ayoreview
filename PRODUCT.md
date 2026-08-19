# ReviewTap

## Product
Smart NFC & QR review infrastructure. B2B SaaS + physical hardware for local businesses.

## Primary user
Merchant / venue owner who wants more Google reviews from in-store customers. Secondary: platform operator managing hardware inventory.

## Job
Eliminate the 8-step friction of finding a business on Google Maps to leave a review. Customer taps NFC or scans QR → lands on Google review page in <1s.

## Meaningfully different mechanism
Physical cards encode a managed redirect (`reviewtap.id/q/:publicId`), not the destination URL directly. Merchant changes the Google Review URL in their dashboard — all physical cards update instantly, no reprint needed.

## Hierarchy
Organization → Business → Location → Card → Interaction

## Core capabilities
- QR/NFC redirect engine with bot filtering, device detection, IP hashing
- Merchant dashboard with real-time analytics (30-day trends, QR/NFC split, placement conversion)
- Operator admin portal (batch hardware provisioning, inventory assignment, card replacement)
- 5-step onboarding wizard
- Card print generator with high-DPI QR (PNG + SVG)

## Constraints
- Next.js 15 + Supabase (PostgreSQL) + TailwindCSS v4
- Dark theme (zinc + emerald)
- Auth via Supabase; all card/QR creation requires an account
- Public redirect routes are unauthenticated (customer-facing)

## Voice
Confident, direct, infrastructure-minded. The product is a utility, not a gimmick.
