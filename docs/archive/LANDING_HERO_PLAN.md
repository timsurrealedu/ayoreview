# Landing Hero Improvement Plan

## Goal

Make the first viewport communicate ReviewTap's defensible promise—**change the destination, not the deployed card**—while preserving the current Indonesian positioning, real product imagery, and purchase flow.

Scope: `/` navigation, hero, and the first transition below it. No dashboard, backend, pricing, testimonial, product-claim, or Indonesian copy changes.

## Audit Summary

Design health: **19/32** across applicable Nielsen heuristics. The hero is readable, responsive, and grounded by real product imagery, but its message and styling conflict with the committed “Routing Exchange” direction.

### What already works

- Clear desktop reading order: eyebrow → headline → explanation → CTA.
- The real NFC/QR card makes the physical product understandable immediately.
- Responsive stacking, visible focus treatment, and reduced-motion handling already exist.
- Automated Impeccable scan found no mechanical violations in `src/app/page.tsx`; browser checks found no clipping or horizontal overflow at 1440×1100 or 390×844.

### Priority weaknesses and inconsistencies

| Priority | Finding | Evidence | Required outcome |
|---|---|---|---|
| P1 | The hero omits the managed-redirect advantage. | `src/app/page.tsx:42` promises reviews and ranking, but not a stable card with an editable destination. | State and demonstrate “change the link, not the card” before the first scroll. |
| P1 | The visual system contradicts `DESIGN.md`. | `src/app/landing.css:1-4` uses Google colors, a conic-gradient mark, circular ornaments, 12–18px radii, blurred shadows, and a floating star badge. | Use dispatch navy/signal orange, 4px corners, fine rules, route lines, stable IDs, and mono operational labels. |
| P1 | Mobile action hierarchy is crowded. | `ActivateCardModal` appears in both nav and hero; at 390px the nav control wraps to three lines and competes with the wordmark and “Masuk.” | One dominant buyer action; compact existing-customer access that fits a 64px header. |
| P1 | The headline overclaims and underexplains. | “Tingkatkan peringkat Google” implies an outcome without evidence while the actual friction-reduction mechanism is vague. | Lead with a precise, supportable benefit; avoid guaranteed ranking language. |
| P2 | The rating badge resembles proof without proving anything. | Five stars plus “Lebih mudah diminta” have no customer, source, rating, or measured result. | Replace decorative proof with factual route state or destination-change evidence. |
| P2 | Hero styling lacks the documented operational type layer. | Archivo is present; IBM Plex Mono and route/ID notation are absent. | Reserve mono type for card IDs, destinations, and state labels. |

The UI/UX Pro Max database recommended familiar SaaS trust colors and social proof, but those generic recommendations conflict with ReviewTap's documented brand and proof policy. Keep its useful accessibility, responsive, focus, and CTA guidance; reject unverified testimonials, ratings, and category-default styling.

## Proposed Direction: The Persistent Route

Build the hero around one physical card that remains visually fixed while its destination changes from an old Google review URL to a new one.

- Left: direct problem/benefit copy and one primary purchase CTA.
- Right: the real card anchored to a crisp routing diagram.
- Route notation: stable card ID, `NFC / QR`, current destination, and a visible `UPDATED` state in IBM Plex Mono.
- Motion: one short route-switch transition using opacity/transform only; static final state under `prefers-reduced-motion`.
- Decoration: thermal-label edges, fine dispatch rules, unequal route stops, and restrained orange route state—not stars, blobs, gradients, or glass.

## Implementation Plan

### 1. Preserve the conversion story

- Keep the existing Indonesian headline, deck, labels, and calls to action verbatim.
- Improve comprehension through hierarchy and visual routing cues rather than new claims or copy.
- Keep `Beli Sekarang` as the sole primary hero CTA.
- Move activation into a clearly labeled existing-customer path; do not give it equal weight with purchase.
- Remove the five-star badge unless approved evidence is supplied.

Acceptance:

- A first-time merchant can answer “what is it?”, “why is it different?”, and “what should I do?” from the first viewport.
- No existing visible Indonesian copy is added, removed, translated, or rewritten.

### 2. Recompose the hero around routing evidence

- Preserve `review-card-reference.png` as the visual anchor.
- Add a compact route panel showing one stable card ID and a destination transition.
- Make the card persistent while only the route endpoint/state changes.
- Remove Google-color circles and the floating rating badge.
- Keep the product image above the fold at desktop and reveal a meaningful portion within the first mobile viewport where feasible.

Acceptance:

- The composition remains intelligible without animation.
- Removing the logo and product name would still leave a visual system specific to managed NFC/QR routing.

### 3. Align tokens and components with `DESIGN.md`

- Replace hero-local Google palette values with `#F1F3F5`, `#13213C`, `#667080`, white, and `#F0441E`.
- Normalize hero/nav geometry to 4px corners and 1px rules.
- Remove gradients, glows, decorative glass, and oversized blur shadows from the scoped area.
- Add IBM Plex Mono for route IDs and operational labels only; retain Archivo for display/body.
- Remove the inline nav action wrapper style and give it a named class.

Acceptance:

- Scoped CSS has no gradient declarations or radii above 4px except the physical card asset treatment if its real-world geometry requires it.
- Orange is reserved for the primary action and active route state.

### 4. Fix mobile navigation and action hierarchy

- At ≤720px, show the wordmark plus one compact account/menu control; do not render the full activation label in the header.
- Keep activation reachable in one additional action without repeating it beside the primary CTA.
- Verify 44×44px minimum touch targets and visible keyboard focus.
- Test text wrapping at 320px, 375px, 390px, and 430px.

Acceptance:

- No header control wraps, overlaps, or exceeds the 64px header.
- No horizontal scroll; CTA labels remain unbroken and understandable.

### 5. Make the first transition reinforce the promise

- Adjust the first section below the hero so it explains the customer friction and then hands off to the managed-route benefit.
- Avoid repeating generic review/rating language already covered in the hero.
- Keep the next section visually quieter than the hero so the first-fold message remains the peak.

Acceptance:

- The hero and following section form one argument rather than two separate marketing claims.

## Verification

- Run lint/type/build checks available in the repository.
- Run the Impeccable detector once after UI changes.
- Browser-check at 375×812, 768×1024, 1024×768, and 1440×1100.
- Verify keyboard order, focus visibility, CTA accessible names, image alt text, 200% zoom, and reduced motion.
- Confirm hero LCP still uses the priority `next/image` asset with accurate `sizes`.
- Re-score the applicable heuristics; target **26/32 or higher**, with Consistency and Standards and Aesthetic/Minimalist Design each at least 3/4.

## Non-goals

- Inventing testimonials, customer logos, aggregate ratings, or performance metrics.
- Changing authentication, activation, purchase routes, or backend behavior.
- Redesigning sections below the first narrative transition.
- Replacing the approved physical-card asset.

## Recommended Order

1. Lock the current Indonesian copy and confirm activation placement.
2. Build the static routing composition.
3. Apply design-system token corrections.
4. Add restrained route-state motion.
5. Complete responsive, accessibility, and performance verification.
