# ReviewTap visual contrast and color-system audit

Date: 2026-08-22  
Production audited: `https://reviewtap-red.vercel.app`  
Scope: every UI page under `src/app`, excluding landing page `/` as an audit target. The landing page is the visual reference.

## Method and limitations

- Inventoried all 21 non-landing `page.tsx` routes and their shared layouts/components.
- Opened every route on production. Public pages were visually captured at 1440×1000. Protected dashboard, admin, and `/my` routes correctly redirected to `/login`; their authenticated content was therefore audited from the exact source and shared production CSS rather than by bypassing authentication.
- Production rate limiting returned HTTP 429 after repeated route checks and rendered raw JSON on `/login`: `{"success":false,"error":"Too many requests. Please slow down."}`. This is also a user-facing presentation defect.
- Contrast ratios below use the deployed/global token values in `src/app/globals.css`. WCAG AA requires 4.5:1 for normal text and 3:1 for large text.

## Executive summary

**Verdict: fail.** The landing page is a coherent Google-inspired light system, but the product pages retain old dark-theme class names that are globally remapped into light colors. That compatibility layer creates deterministic contrast failures and mixed visual grammar. The most serious examples are white-on-white Google sign-in text (1.00:1), dark text on Google blue buttons (3.57:1), and yellow/sky/purple/green status text on white (2.07–3.06:1).

Severity count: **P0 0 · P1 5 · P2 5 · P3 2**.

| Dimension | Score | Key finding |
|---|---:|---|
| Accessibility / contrast | 1/4 | Repeated WCAG AA failures across primary actions, OAuth controls, errors, and status text |
| Landing-page consistency | 2/4 | Shared fonts and Google colors, but incompatible dark-era class vocabulary and shape system remain |
| Google-inspired color semantics | 2/4 | Blue is used correctly for actions, but green tokens are aliased to blue and yellow/purple/sky are used as body text |
| Elements / responsive structure | 2/4 | Dashboard has no mobile navigation; admin header and print card can overflow |
| Implementation integrity | 1/4 | Global selector overrides conceal rather than remove the old theme |
| **Total** | **8/20 — Poor** | **Requires a token/class migration, not isolated color tweaks** |

## Contrast findings

### [P1] Primary blue buttons render dark text below AA

- **Pages:** login, signup, onboarding, setup, fallback, dashboard overview/analytics/card detail/print, plus shared sidebar branding.
- **Evidence:** `globals.css:64` rewrites `.text-white` to `#202124`; buttons use `bg-[#1a73e8] text-white`.
- **Measured ratio:** `#202124` on `#1a73e8` = **3.57:1**.
- **Impact:** normal-size labels on the product’s main calls to action fail WCAG 1.4.3.
- **Fix:** stop globally redefining `.text-white`; use a semantic `--primary-foreground: #fff` token on blue actions.

### [P1] Google OAuth button text can become white on white

- **Pages:** `/login`, `/signup`.
- **Evidence:** `login/page.tsx:103`, `signup/page.tsx:132` use `bg-white text-zinc-900`; `globals.css:7` redefines `zinc-900` as white.
- **Measured ratio:** `#fff` on `#fff` = **1.00:1**.
- **Impact:** the main authentication option can lose its visible label.
- **Fix:** use semantic foreground tokens or explicit landing ink (`#202124`) instead of redefining Tailwind’s zinc scale.

### [P1] Error copy is too pale on light surfaces

- **Pages:** login, signup, dashboard overview, setup; onboarding uses similarly weak rose text.
- **Evidence:** `text-rose-200`/`text-rose-400` over translucent rose on the global white card/background.
- **Measured representative ratios:** rose-200 on white **1.41:1**; rose-400 on white **1.89:1**.
- **Impact:** validation and failure messages are hardest to read exactly when users need recovery guidance.
- **Fix:** use Google red `#b3261e` or another dark red for text, with a pale red container and persistent icon.

### [P1] Yellow, green, sky, and purple status text fails as small text

- **Pages:** admin overview/cards/users; dashboard cards/locations/card detail; `/my`, `/my/billing`, `/my/cards/[id]`; onboarding; setup; fallback; print.
- **Measured ratios on white:** yellow `#e9a900` **2.07:1**; sky-400 **2.14:1**; purple-400 **2.64:1**; Google green `#34a853` **3.06:1**; Google blue `#4285f4` **3.56:1**.
- **Impact:** statuses, IDs, percentages, and links fail WCAG AA at the 10–12px sizes used.
- **Fix:** reserve bright Google colors for icons, borders, fills, and large figures; use darker semantic text variants for labels and links.

### [P1] Rate-limit failures bypass the product UI

- **Observed live:** repeated production navigation produced a black page containing raw JSON on `/login` rather than a branded recovery state.
- **Impact:** no navigation, retry guidance, or visual continuity; task completion is blocked during throttling.
- **Fix:** return a styled 429 page/component with retry timing and preserved landing-page shell.

## Color-system and element findings

### [P2] The global theme is a compatibility patch over old dark classes

- **Evidence:** `globals.css:62–65` maps `#09090b`, `#121215`, `text-white`, zinc, and emerald utilities to unrelated light-theme values.
- **Impact:** class names no longer describe rendered colors; combinations that were safe in dark mode become unsafe in light mode; future edits are error-prone.
- **Fix:** migrate components to semantic classes/tokens, then delete the compatibility selectors.

### [P2] “Emerald” no longer means success

- **Evidence:** `globals.css:15–20` aliases emerald and teal tokens to Google blue.
- **Affected pages:** admin organizations/cards; dashboard cards/locations; shared status badges and creation buttons.
- **Impact:** success, action, and active states become indistinguishable. This contradicts Google-inspired semantics: blue action, green success, yellow attention, red error.
- **Fix:** preserve real semantic green tokens and name action tokens `primary`, not `emerald`.

### [P2] Shape language conflicts with the landing page

- **Evidence:** **249** uses of `rounded-xl`, `rounded-2xl`, `rounded-3xl`, or `rounded-full` across app/components. The landing’s dominant controls are tighter and its design record specifies crisp 4px corners; product screens use soft SaaS cards and pill badges.
- **Impact:** pages feel like a separate template despite sharing typography and colors.
- **Fix:** standardize controls/cards to the landing radius; keep circles only for avatars, progress dots, and true status indicators.

### [P2] Dashboard lacks a mobile navigation alternative

- **Evidence:** `dashboard/layout.tsx:14–18` always renders a fixed `w-60` sidebar; `components/dashboard/sidebar.tsx:44` has no responsive hide/collapse behavior.
- **Affected pages:** all `/dashboard/*` routes.
- **Impact:** narrow screens lose most content width; unlike `/my`, there is no mobile header/menu.
- **Fix:** add a mobile app bar and drawer, or collapse the sidebar below a breakpoint.

### [P2] Admin and print layouts can overflow small screens

- **Evidence:** admin header has fixed horizontal navigation and `px-8` with no mobile alternative (`admin/layout.tsx:17–59`); print card is fixed at `360px` plus page padding (`dashboard/cards/[id]/print/page.tsx:33–51`).
- **Impact:** admin links and print controls can leave the viewport; the print preview exceeds common 360–390px mobile widths.
- **Fix:** wrap/collapse admin navigation and use `w-full max-w-[360px]` for the print preview.

### [P3] The landing reference and product pages use different canvas treatments

- **Observed live:** landing, signup, fallback, and setup are bright paper/white; onboarding renders a near-black full-page shell around a white card.
- **Impact:** onboarding feels detached immediately after signup.
- **Fix:** use the landing paper canvas and the same compact top bar throughout onboarding.

### [P3] Google-inspired accents are overused as text

- **Affected pages:** nearly all operational routes.
- **Impact:** many small colored labels compete for attention and weaken hierarchy.
- **Fix:** default text to ink/muted ink; use Google colors only for action and state, supported by icon/label—not color alone.

## Page-by-page coverage

| Route | Review result |
|---|---|
| `/login` | P1 OAuth white-on-white risk; P1 blue-button contrast; P1 error contrast; live 429 raw JSON observed |
| `/signup` | Same auth contrast failures; otherwise strongest visual match to landing |
| `/onboarding` | P1 blue/yellow/rose contrast; dark canvas breaks continuity; disabled blue is especially faint |
| `/s/[publicId]` | P1 blue buttons and bright status/link text; too many rounded cards/pills; live `/s/demo` inspected |
| `/fallback/[reason]` | P1 blue button/yellow icon contrast; clean structure, but overly rounded card; both known reasons requested live |
| `/dashboard` | P1 blue/error text; fixed desktop sidebar; legacy dark class vocabulary |
| `/dashboard/analytics` | P1 active blue control text; chart colors are semantically useful but labels need ink-safe variants |
| `/dashboard/billing` | Gradient is inconsistent with landing; fixed sidebar; blue badge text below AA |
| `/dashboard/cards` | Yellow/sky/purple status failures; emerald/action alias confusion; table scroll is correctly provided |
| `/dashboard/cards/[id]` | Blue/yellow/green small text failures; rounded-card drift |
| `/dashboard/cards/[id]/print` | Blue button contrast; yellow stars too light; fixed-width mobile overflow |
| `/dashboard/locations` | Amber status failure; emerald alias confusion; modal/card radius drift |
| `/dashboard/locations/[id]` | Amber and semantic-action drift; table scroll is correctly provided |
| `/dashboard/settings` | No unique severe contrast issue beyond shared shell/button rules; excessive rounded cards persist |
| `/admin` | Amber and sky KPI accents fail as small text; fixed header navigation |
| `/admin/cards` | Amber/purple statuses; detector found four gray-on-color patterns; responsive table wrapper is present |
| `/admin/organizations` | Emerald badge is rendered blue; fixed admin navigation |
| `/admin/users` | Amber admin label below AA; fixed admin navigation |
| `/my` | Amber/blue/green/rose status text failures; mobile navigation exists and is a useful pattern for `/dashboard` |
| `/my/billing` | Amber/green badge contrast; rounded pills; table wrapper is present |
| `/my/cards/[id]` | Yellow/green badges and links below AA; otherwise coherent information grouping |

## Positive findings

- Archivo and IBM Plex Mono consistently extend the landing typography.
- Google blue/red/yellow/green are recognizable and mostly assigned to sensible conceptual roles.
- Global focus treatment uses a visible 3px yellow outline.
- Dense tables generally include horizontal-scroll wrappers.
- Signup, fallback, and setup pages use clear single-task composition and visually resemble the landing page.
- The `/my` shell includes a mobile header, a good pattern to reuse.

## Recommended order

1. **P1 — `$impeccable colorize`**: replace the zinc/emerald compatibility remap with semantic foreground, action, success, warning, and error tokens; enforce AA pairs.
2. **P1 — `$impeccable harden`**: add a branded 429 recovery page and verify error/disabled states.
3. **P2 — `$impeccable adapt`**: add dashboard/admin mobile navigation and make print preview fluid.
4. **P2 — `$impeccable distill`**: remove obsolete dark-theme classes and reduce pill/large-radius usage.
5. **P3 — `$impeccable polish`**: align onboarding canvas, spacing, and remaining accents with the landing page.

Re-run the live audit with authenticated merchant and platform-admin test accounts after fixes; protected content could not be rendered without credentials.
