# AyoReview — Arsitektur (per 2026-08-24)

Dokumen ini menggambarkan aplikasi **sebagaimana dibangun** (flat model, one-time pricing). Dokumen lama yang menyinggung `/dashboard/*`, `/onboarding`, hierarki organisasi, atau langganan bulanan adalah artefak sejarah — lihat `docs/archive/`.

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS v4 (`globals.css` tokens) · Supabase (Postgres + Auth + RLS) · Midtrans Snap (satu-satunya payment processor) · Sentry.

## Model Data

Flat model — kartu tidak lagi bergantung pada organisasi/bisnis/lokasi untuk alur order web:

```
cards(id, public_id nanoid(7), inventory_code RT-XXXXXX,
      status active|inactive|lost|replaced,
      place_id?, business_name?, merchant_email?,   ← flat pre-programmed fields
      linked_at?)
orders(id, order_code ORD-XXXXXXXX, status, shipping_address, amount,
       payment_ref, allocated_card_id)
interactions(card_id, source qr|nfc|direct, timestamp, is_bot, ip_hash, device_type)
```

`orders.status`: `pending_payment → paid → paid_unfulfilled → shipped → completed` (+ `failed`/`cancelled`).

**Vestigial:** kolom `subscription_status` / `subscription_id` / `subscription_current_period_end` masih ada di DB (tidak dimigrasi) tapi hanya ditulis `active` saat fulfillment/link. Jangan dibangun di atasnya.

## Alur Uang (satu processor)

1. `POST /api/orders/create` → validasi payload (alamat ≥20 karakter) → buat order `pending_payment` + Midtrans Snap token.
2. `POST /api/midtrans/webhook` → verifikasi signature → `fulfillOrder()`:
   - Klaim idempoten: update `payment_ref` conditional `.eq('status','pending_payment').is('payment_ref', null)`.
   - Alokasi kartu kosong: conditional update `.is('place_id', null)` mencegah double-alokasi.
   - Fulfillment = aktivasi: kartu tertulis `place_id`, `merchant_email`, `linked_at`.
3. Halaman sukses `/pesan/sukses` juga memverifikasi ulang ke Midtrans (belt-and-suspenders) karena `fulfillOrder` idempoten.

## Redirect Engine

`src/app/q/[publicId]/route.ts` dan twin NFC `/n`:

1. Kartu tak ada → `/fallback/not-found`
2. Belum tertaut → `/s/:publicId` (setup wizard)
3. `status !== 'active'` → `/fallback/inactive`
4. Resolusi tujuan: `buildReviewUrl(place_id)` atau `google_review_url`
5. Validasi ketat host Google → gagal = `/fallback/unconfigured`
6. Log interaksi via `after()` (non-blocking), bot-filtered, IP di-HMAC (`IP_HASH_SECRET`)
7. 302 ke URL tersanitasi

`?test=true` hanya dihormati bagi request dengan session terautentikasi (`isAuthenticatedRequest`).

## Auth

- Supabase Auth (email/password + Google OAuth), session via `@supabase/ssr`.
- Middleware (`src/middleware.ts`): rate limiting per-tier + refresh session + guard `/my`,`/admin`. **Tidak pernah 500** saat env Supabase hilang/rusak — degrade jadi anonymous.
- Guard halaman: `requireUser()` / `requirePlatformAdmin()`; API admin via `checkAdminApiAccess()`. `ADMIN_EMAILS` + flag `users.is_platform_admin`.
- Kepemilikan kartu = string email (ilike). Risiko orphaning didokumentasikan di SECURITY.md.

## Analytics

Semua agregasi interaksi lewat SQL RPC (`supabase/migrations/009_analytics_aggregates.sql`):
`get_card_analytics(card_id)` dan `get_cards_stats_by_email(email)` — indexed counts, tanpa fetch baris.

## Layout & Shell

- `/my`: satu halaman mandiri dengan header tipis (logo, email, keluar) — tanpa sidebar.
- `/admin`: shell sidebar (`components/dashboard/sidebar.tsx`) — pola a11y referensi (skip link, focus trap, Esc, scroll lock).
- Modal bersama: `components/ui/modal.tsx` (Esc, click-outside, focus trap, scroll lock, animasi `prefers-reduced-motion`-aware).

## Verifikasi

```bash
npx tsc --noEmit
npm run lint
npm run build
BASE_URL=http://localhost:3000 bash scripts/smoke.sh   # 13 hard checks
```

## Known Limitations

1. Rate limiter in-memory per instance (lihat SECURITY.md).
2. Email change mengorbankan akses kartu (accepted risk, post-beta).
3. Migrasi 009 harus diterapkan sebelum deploy kode yang memanggil RPC baru.
