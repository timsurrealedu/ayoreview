# ReviewTap Design System

## Platform and modes

Web on Next.js 15 and Tailwind CSS v4. The landing page is **Persuade**; authenticated product surfaces are **Operate**.

## Landing: Routing Exchange

The `/` route uses the managed redirect as its visual and narrative system: stable identifiers, replaceable destinations, routing lines, thermal labels, adhesive edges, and dispatch notation. The central promise is “change the link, not the card.”

### Palette

- Canvas: cool paper `#F1F3F5`
- Ink: dispatch navy `#13213C`
- Muted text: `#667080`
- Surface: white
- Accent: signal orange `#F0441E`, used only for action and route state
- Dark system preference: night-dispatch navy surfaces with off-white text

### Type

- Archivo for display and body copy
- IBM Plex Mono for routes, IDs, sample-state flags, and operational labels
- Display tracking never tighter than `-0.04em`; body copy stays within readable measures

### Shape, layout, and motion

- Consistent 4px corners; fine 1px rules; no pills, gradients, glows, or decorative glass
- Unequal route stops and asymmetric photographic placement compositions replace repeated card grids
- Motion communicates action or routing state through transform and opacity only
- All motion becomes static under `prefers-reduced-motion`
- Controls maintain 44px minimum targets and visible keyboard focus

### Imagery

Merchant scenes use documentary product photography with cool daylight, pale stone, navy details, and restrained signal-orange accents. Generated assets include useful alt text, explicit dimensions through `next/image`, responsive `sizes`, and provenance in the page footer.

### Proof policy

Quotes, logos, and pilot metrics remain visibly marked with `data-placeholder` until the evidence, attribution, timeframe, sample size, and usage permission are approved. Placeholder content must never resemble a shipped claim.

## Product surfaces

Dashboard, authentication, onboarding, admin, and fallback routes extend the landing page's visual language in **Operate** mode. They share Archivo and IBM Plex Mono, cool-paper canvases, white surfaces, navy ink, blue actions, crisp rules, restrained shadows, and visible yellow focus rings. Existing route behavior and information hierarchy remain intact.

Operational screens use signal colors semantically: blue for actions and active routing state, green for success, yellow for attention, and red for destructive or failed states. Dense product views may retain compact type and layouts, but use the same browser surfaces, controls, and 4px corner system. The physical-card print route remains optimized for print fidelity.
