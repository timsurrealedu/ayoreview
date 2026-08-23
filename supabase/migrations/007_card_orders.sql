-- 007_card_orders.sql
-- Online order flow: configure-first ordering with shipping, paid via Stripe one-time checkout.
-- On payment, an available blank card is allocated from inventory and pre-linked to the ordered listing.

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_payment',
  place_id TEXT,
  business_name TEXT NOT NULL,
  merchant_name TEXT NOT NULL,
  merchant_email TEXT NOT NULL,
  merchant_phone TEXT,
  shipping_address TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'idr',
  stripe_checkout_session_id TEXT UNIQUE,
  allocated_card_id TEXT REFERENCES cards(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_merchant_email ON orders(merchant_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Orders are operator-managed rows; RLS stays closed to anon/authenticated by default.
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
