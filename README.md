# AyoReview — Kartu Ulasan Google NFC & QR

<div align="center">

![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-336791?style=for-the-badge&logo=supabase)

**Ubah pelanggan yang puas menjadi ulasan Google bintang 5 — cukup ketuk atau pindai.**

[Pesan](#alur-pembelian) • [Redirect Engine](#redirect-engine) • [Quick Start](#quick-start) • [API](#api-reference)

</div>

---

## Overview

AyoReview menjual kartu fisik (NFC acrylic stand + QR) seharga **Rp 30.000 sekali bayar** — tanpa biaya bulanan. Kartu dialokasikan dari inventaris dan **dipra-tautkan ke profil Google bisnis sebelum dikirim**. Pelanggan mengetap/memindai → langsung diarahkan ke form ulasan Google bisnis tersebut.

## Alur Pembelian

1. Merchant membuka `/pesan`, menghubungkan bisnis (tempel tautan Google **atau** cari di Google Maps), isi alamat pengiriman, bayar via **Midtrans** (QRIS/GoPay/VA).
2. Webhook Midtrans memverifikasi pembayaran → `fulfillOrder()` mengklaim kartu kosong dari inventaris secara race-safe (conditional update + idempotency guard) dan mempra-tautkannya.
3. Operator mencetak dudukan (`/admin/orders` → link cetak), mengirim, lalu menandai pesanan *Dikirim* / *Selesai* dari dasbor admin.
4. Merchant masuk ke `/my`: status kartu, jumlah ketukan, **edit tujuan ulasan**, tombol uji tautan.

## Redirect Engine

- `GET /q/:publicId` (QR) dan `GET /n/:publicId` (NFC) → validasi kartu → 302 ke URL ulasan Google yang tervalidasi ketat (`validateGoogleReviewUrl`, hanya host Google resmi).
- `GET /r/:publicId` alias → `/q/:publicId`.
- Interaksi dicatat asinkron via `after()` dengan bot filtering + IP hashing (`IP_HASH_SECRET`).
- Fallback bermartabat: `/fallback/not-found|unconfigured|inactive` — copy pemulihan untuk pelanggan, bukan CTA penjualan.
- Rate limit per-tier di middleware; permintaan browser diarahkan ke halaman `/rate-limited` berbahasa Indonesia.

## Quick Start

```bash
npm install
cp .env.example .env.local   # isi kredensial Supabase & Midtrans
# Terapkan migrasi di supabase/migrations/ ke project Supabase Anda
# (wajib termasuk 009_analytics_aggregates.sql)
npm run dev
```

Verifikasi cepat: `BASE_URL=http://localhost:3000 bash scripts/smoke.sh`

## API Reference

| Endpoint | Auth | Fungsi |
|---|---|---|
| `POST /api/setup/search` | public (rate-limited) | Cari lokasi Google Places |
| `POST /api/setup/link` | owner session untuk kartu tertaut | Tautkan / ubah tujuan ulasan |
| `GET /api/setup/card-status` | public (rate-limited) | Cek keberadaan & status kartu |
| `POST /api/orders/create` | public (rate-limited) | Buat pesanan + Midtrans Snap token |
| `POST /api/midtrans/webhook` | signature Midtrans | Konfirmasi pembayaran → fulfillment |
| `POST /api/admin/batch-generate` | platform admin | Generate kartu kosong RT-XXXXXX |
| `POST /api/admin/assign` | platform admin | Tetapkan kartu ke lokasi bisnis |
| `GET /api/admin/inventory` | platform admin | Daftar inventaris |
| `POST /api/admin/orders/update-status` | platform admin | shipped/completed/cancelled/failed |

## Dokumentasi

- [ARCHITECTURE.md](./ARCHITECTURE.md) — arsitektur teknis saat ini
- [DESIGN.md](./DESIGN.md) — design tokens & aturan UI
- [SECURITY.md](./SECURITY.md) — model ancaman + risiko yang diterima
- `docs/archive/` — dokumen perencanaan historis (tidak menggambarkan produk)
