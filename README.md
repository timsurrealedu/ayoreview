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
- 📱 **Hardware-Enabled NFC & QR Integration**: Built-in high-DPI vector SVG and PNG QR generator + print-ready acrylic stand card generator (`/dashboard/cards/[id]/print`).
- 🏬 **Multi-Location & Multi-Business Support**: Unified organizational hierarchy (`Organization -> Businesses -> Locations -> Cards -> Interactions`).
- 📊 **Real-Time Merchant Dashboard**: 30-day interactive visit trends (Recharts), QR vs NFC hardware split, placement zone conversion analysis, and CSV export.
- 🛠️ **Platform Operator Admin Portal**: Batch blank hardware provisioning (`RT-000000` series), on-site venue assignment, and card replacement workflows with preserved historical analytics.
- 🧙‍♂️ **3-Minute Onboarding Wizard**: Guided 5-step flow for merchants to configure their business, location, Google review link, and deploy their first card.

---

## Architecture

```text
Customer
   │
   ├── (NFC Tap) ────> GET /n/:publicId ───┐
   │                                       │
   └── (QR Scan) ────> GET /q/:publicId ───┤
                                           │
                                  [ReviewTap Engine]
                                  ├─ Bot Filter & Device Detection
                                  ├─ Async Interaction Logging
                                  └─ 302 Fast Redirect
                                           │
                                           ▼
                             [Google Review Destination]
```

### Data Model Hierarchy
```text
Organization (e.g. Timothy Hospitality Group)
 └── Business (e.g. Kopi Contoh)
      └── Location (e.g. Kemanggisan Flagship)
           └── Card (e.g. Kasir 01 · RT-000101)
                └── Interaction (source: 'qr' | 'nfc', timestamp, device)
```

---

## Physical Hardware Specification

- **Recommended Stand**: Clear cast acrylic stand ($8 \times 12\text{ cm}$ or $10 \times 15\text{ cm}$).
- **NFC Tag**: NTAG213 (144 bytes memory, universal iOS & Android compatibility).
  - Target URL: `https://reviewtap.id/n/{publicId}`
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
- **Landing Page & Live Simulator**: `http://localhost:3000`
- **Merchant Dashboard**: `http://localhost:3000/dashboard`
- **Setup Wizard**: `http://localhost:3000/onboarding`
- **Operator Admin Portal**: `http://localhost:3000/admin/cards`
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
| `GET` | `/q/:publicId` | Dynamic QR code entrypoint (records `qr` interaction + 302 redirect) |
| `GET` | `/n/:publicId` | Dynamic NFC tag entrypoint (records `nfc` interaction + 302 redirect) |
| `GET` | `/r/:publicId` | Universal redirect handler |

### Merchant REST APIs
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
