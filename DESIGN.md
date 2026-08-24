# ReviewTap Design System

## Platform and modes

Web on Next.js 15 and Tailwind CSS v4. The landing page is **Persuade**; authenticated product surfaces are **Operate**.

## Canonical logo

The only brand mark is the AyoReview tap logo: a blue vertical-gradient rounded square containing a white speech bubble with five gold stars above a white tap-hand with NFC ripples.

- Source of truth: `public/images/logo.svg` (vector, viewBox `0 0 120 120`).
- In-app rendering: `<Logo size={n} />` from `src/components/ui/logo.tsx` — always inline SVG via this component; never recreate the mark with text tiles, conic gradients, colored dots, or unicode glyphs.
- Favicon: `src/app/icon.svg` (same mark, Next.js file convention).
- The logo appears everywhere a brand mark is shown: landing nav/footer, order wizard, order success, setup wizard, login, signup, dashboard/admin sidebar, rate-limited page, fallback pages, global error, and the physical-card print template.
- Do not introduce alternate mark variants; changes go through `logo.tsx` and `logo.svg` only.

## Shared palette (semantic tokens, `globals.css`)

All surfaces draw from the same Tailwind v4 `@theme` tokens; hardcoded hexes are a defect.

- Canvas: warm white `#FBFAFF`
- Surface: white
- Subtle: `#F4F1FC`
- Ink: deep violet-navy `#241B3E`
- Muted text: `#6F6893` (≥4.5:1 on white)
- Line: `#E7E3F4`
- Action: violet `#7C3AED`, hover `#6D28D9`, soft `#F1EAFE`
- Success: green `#0C9D61` (landing data text uses darker `#0B7D4E` at small sizes), soft `#E0F8EE`
- Warning: amber `#B45309`, soft `#FDF1DF`
- Error: rose `#E11D48`, soft `#FFE8EE`
- Signature gradient: violet → magenta → orange (`--gradient-fun`), used for brand moments (closing band, wordmark ring), never for body text

## Landing: The Counter That Counts

The `/` route shows the product working before explaining it. The first viewport is the merchant's own dashboard mid-count — a labeled illustrative mock with a rising review number, NFC/QR split bars, and a drawn 30-day sparkline — overlapped by the physical card. The pitch is proof-of-life, not claims.

### Type

- Archivo for display and body copy (loaded via `next/font`)
- Display tracking `-0.03em`; headings use `text-wrap: balance`
- Emphasis comes from weight and solid violet color, never gradient text

### Shape, layout, and motion

- 12–20px radii (buttons 12–14px, panels 16–24px); soft offset shadows with real blur, tinted violet-navy
- One authored motion moment per load: count-up + sparkline draw + split-bar fill in the hero mock; everything else is a single shared scroll reveal
- The physical card photo floats behind the dashboard panel, never covering data
- All motion becomes static under `prefers-reduced-motion`
- Controls maintain 44px minimum targets and visible violet focus rings

### Imagery

Real assets only: the physical card reference photo and the three-scene documentary placement strip (`placement-scenes.png`, cashier/table/reception crops). Assets carry useful alt text, `next/image` with responsive `sizes`, and provenance sidecars.

### Proof policy

The hero dashboard mock is demonstration data and is labeled as such ("Contoh tampilan dasbor Anda"). No testimonials, logos, or performance metrics are fabricated; unanswered claims ship as marked placeholders, never silent omissions.

## Product surfaces

Dashboard, authentication, onboarding, admin, and fallback routes extend the landing page's visual language in **Operate** mode: Archivo, warm-white canvas, white surfaces, violet-navy ink, violet actions, soft shadows, and visible focus rings. Existing route behavior and information hierarchy remain intact.

Operational screens use signal colors semantically: violet for actions and active state, green for success, amber for attention, rose for destructive or failed states. Dense product views may retain compact type and layouts but share the same tokens, surfaces, and corner system. The physical-card print route remains optimized for print fidelity.

## Craft floor

- No kickers or eyebrows above headings; no gradient text; no hard offset shadows; no colored side-stripes above 1px
- Icons are drawn (lucide-react) in one stroke weight; no emoji or unicode glyphs as icons
- Text contrast ≥4.5:1 body, ≥3:1 large; secondary text on tinted surfaces tints from the hue, never gray
