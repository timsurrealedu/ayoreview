# ReviewTap Design System

## Platform
Web (Next.js 15 + TailwindCSS v4)

## Mode
Landing: **Persuade** — the visitor decides and acts; design is the product.
Dashboard: **Operate** — the visitor completes a task.

## Palette
- Canvas: `#08080b` (near-black), cards `#111115`
- Primary: emerald-500 (`#10b981`) — CTAs, active states, key metrics
- Accent: teal-400 (`#2dd4bf`) — secondary gradient element
- Alert/rating: amber-400 (`#fbbf24`) — star ratings
- Neutral: zinc-800 (`#27272a`) borders, zinc-400 (`#a1a1aa`) secondary text, zinc-300 (`#d4d4d8`) body
- Text on emerald buttons: zinc-950 (`#09090b`)
- Bg surfaces: zinc-900 (`#18181b`), zinc-950 (`#0a0a0b`)

## Typography
- Display: font-black (900), tracking-[-0.03em], sizes 4xl-6xl
- Body: text-sm to text-lg, text-zinc-400, relaxed leading
- Labels/meta: text-[10px] to text-xs, uppercase tracking-[0.15em] for section headers
- Mono: font-mono for URLs, codes, technical data

## Components
- **Cards**: rounded-2xl (12px), 1px border zinc-800/80, bg-[#111115]
- **Buttons**: rounded-xl, emerald-500 bg, text-zinc-950 font-bold, shadow-lg shadow-emerald-500/25, active:scale-[0.97]
- **Secondary buttons**: bg-zinc-900, border zinc-800, text-zinc-300
- **Badges/pills**: rounded-full, bg-emerald-500/10, border emerald-500/20, text-emerald-400 text-xs
- **Inputs**: bg-zinc-900, border zinc-800, rounded-xl, focus:border-emerald-500
- **Progress**: gradient from emerald-500 to teal-400

## Layout
- Max content width: max-w-6xl (landing), max-w-7xl (dashboard)
- Section padding: py-20 px-6 sm:px-10
- Grid gaps: gap-6 (cards), gap-12 (hero columns)
- Card padding: p-6 to p-8

## Key UX Patterns
- Onboarding: 5-step wizard with circular progress indicators, gradient progress bar
- Dashboard: sticky header with CTA buttons, floating FAB on cards page
- Redirect demo: interactive "Change Destination" inline editor showing URL update
