# ReviewTap — Smart NFC & QR Review Infrastructure

<div align="center">

![ReviewTap V1](https://img.shields.io/badge/ReviewTap-V1.0.0-10b981?style=for-the-badge)
![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js)
![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8?style=for-the-badge&logo=tailwindcss)
![PostgreSQL / SQLite](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20SQLite-336791?style=for-the-badge&logo=postgresql)

**Turn happy in-store customers into 5-star Google reviews with physical NFC tap & dynamic QR cards.**

[Key Features](#key-features) • [Architecture](#architecture) • [Physical Hardware](#physical-hardware) • [Quick Start](#quick-start) • [API Reference](#api-reference)

</div>

---

## Overview

**ReviewTap** connects physical customer touchpoints (dining tables, POS cashiers, waiting areas, and entrance counters) with digital Google review destinations through managed NFC acrylic stands and dynamic QR codes.

### The Problem ReviewTap Solves
1. **Friction-Free Customer Review Flow**: Eliminates 8+ manual steps (unlocking phone, searching business on Maps, selecting branch, scrolling to reviews, clicking review). Customers simply tap or scan to open the review star selector in < 1 second.
2. **Dynamic Destination Routing**: Physical cards and QR codes encode dynamic ReviewTap redirect endpoints (`reviewtap.id/q/:publicId` and `reviewtap.id/n/:publicId`). Merchants can update their Google Review destination URL anytime without reprinting physical hardware.
3. **Physical-to-Digital Interaction Analytics**: Tracks scan/tap volume, QR vs NFC ratios, best-performing placement zones (Cashier vs Table vs Entrance), and multi-branch performance metrics in real time.

---

## Key Features

- ⚡ **Ultra-Fast Sub-Second Redirect Engine (<100ms)**: Lightweight 302 redirect engine with automated crawler/bot detection (`is_bot`) and anonymous interaction logging.
- 🛒 **Order-First Sales Flow (`/pesan`)**: Merchant configures their Google listing, enters shipping details, and pays for the physical card in one pass. The ordered card is allocated from inventory and **pre-linked before it ships** — scan-to-activate (`/s/:publicId`) remains the door-to-door salesman channel.
- 🛡️ **Monthly Subscription & 7-Day Grace Period**: Automated monthly card subscription with Stripe. If payment fails or cancels, a **7-day grace period** keeps customer review redirects alive before cutoff. No trial bypass — cards only go live after the subscription is paid.
- 📱 **Hardware-Enabled NFC & QR Integration**: Built-in high-DPI vector SVG and PNG QR generator + print-ready acrylic stand card generator (`/admin/cards/[id]/print`).
- 📊 **Real-Time Analytics**: 30-day visit trends, QR vs NFC hardware split, placement zone conversion analysis, and daily metrics.
- 🛠️ **Platform Operator Admin Portal (`/admin`)**: Incoming card orders (`/admin/orders`), batch pre-pro card generation (`RT-100000` series), on-site venue assignment, and inventory monitoring.

---

## Architecture & Workflows

### 1. Order-First Flow (Web Channel)
```text
1. Merchant configures their listing on /pesan (paste review link or Google Places search).
2. Merchant enters contact + shipping address, pays via Stripe Checkout (one-time).
3. Webhook fulfills the order: a blank card is allocated from inventory and pre-linked.
4. Operator prints (/admin/cards/[id]/print) and ships the card.
5. Card arrives live: customer taps/scans -> Google Review form instantly.
```

### 2. Pre-Programmed Card Flow (Salesman Channel)
```text
1. Operator batch generates blank cards in /admin/cards.
2. Physical card manufactured with NFC/QR pointing to: https://reviewtap.id/q/:publicId.
3. Merchant buys card on-site, scans it -> redirected to https://reviewtap.id/s/:publicId.
4. Merchant searches business via Google Places API, connects account & starts subscription.
5. All future customer taps/scans immediately redirect to Google Review form.
```

### 2. Redirect Engine & Grace Period Resolution
```text
Customer Tap/Scan (GET /q/:publicId or /n/:publicId)
   │
   ├─ Card not found? ─────────────> 302 /fallback/not-found
   ├─ Card unlinked (no place_id)? ─> 302 /s/:publicId (Setup Wizard)
   ├─ Subscription inactive/past-due?
   │     ├─ Within 7-day grace period? ──> ALLOW REDIRECT (Grace active)
   │     └─ Past 7-day grace period? ────> 302 /fallback/inactive
   │
   └─ Valid card & active subscription:
         ├─ Resolves Google Review URL (Places API / Direct link)
         ├─ Asynchronously records interaction (NFC/QR, bot check, IP hash)
         └─ 302 Fast Redirect to Google Review Form (< 1s)
```

---

## Physical Hardware Specification

- **Recommended Stand**: Clear cast acrylic stand ($8 \times 12\text{ cm}$ or $10 \times 15\text{ cm}$).
- **NFC Tag**: NTAG213 (144 bytes memory, universal iOS & Android compatibility).
  - Target URL: `https://reviewtap.id/n/{publicId}` (or `/q/{publicId}`)
- **QR Code**: High-contrast error correction level H with white quiet zone.
  - Target URL: `https://reviewtap.id/q/{publicId}`
- **Inventory Code**: Discrete laser-engraved/printed `RT-XXXXXX` serial for on-site inventory identification.

---

## Quick Start

### Prerequisites
- Node.js 18.18+ (tested on Node v24)
- npm or pnpm

### Installation

```bash
# Clone repository
git clone https://github.com/timsurrealedu/reviewtap.git
cd reviewtap

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application:
- **Landing Page**: `http://localhost:3000`
- **Order Wizard (Web Sales Channel)**: `http://localhost:3000/pesan`
- **Pre-Programmed Card Setup Wizard**: `http://localhost:3000/s/DEMO_CARD_ID`
- **Merchant Dashboard**: `http://localhost:3000/my`
- **Operator Admin Portal**: `http://localhost:3000/admin/orders`
- **Test Live Redirect**: `http://localhost:3000/q/a7Xk29?test=true`

### Production Build

```bash
npm run build
npm run start
```

---

## API Reference

### Redirect Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/q/:publicId` | Dynamic QR entrypoint (routes unlinked cards to `/s/:publicId` or active cards to Google Review) |
| `GET` | `/n/:publicId` | Dynamic NFC entrypoint (same logic, logs source as `nfc`) |
| `GET` | `/r/:publicId` | Universal redirect handler |

### Pre-Programmed Setup & Billing APIs
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders/create` | Creates a card order + Stripe Checkout session (one-time payment) |
| `POST` | `/api/setup/search` | Google Places API (New) text search with rate limiting |
| `POST` | `/api/setup/link` | Links Google Place ID and merchant email to card (owner-guarded re-link) |
| `POST` | `/api/stripe/create-checkout` | Creates Stripe Checkout subscription session |
| `POST` | `/api/stripe/webhook` | Handles Stripe billing events, order fulfillment & 7-day grace period triggers |

### Classic & Admin REST APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET` / `POST` | `/api/businesses` | List or create merchant businesses |
| `GET` / `POST` / `PATCH` | `/api/locations` | Manage branches and update Google Review URLs |
| `GET` / `POST` | `/api/cards` | List cards or create new review cards |
| `GET` / `PATCH` | `/api/cards/:id` | Card detail, placement, and status toggles |
| `GET` | `/api/analytics` | Overview metrics, 30-day trends, and placement breakdowns |
| `POST` | `/api/admin/batch-generate` | Operator tool to generate blank hardware serials |
| `POST` | `/api/admin/assign` | Assign blank inventory cards to merchant locations |

---

## License

MIT License. Designed for commercial pilot deployments in local hospitality, healthcare, and retail businesses.
