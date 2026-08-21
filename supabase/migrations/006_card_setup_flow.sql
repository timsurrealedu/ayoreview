-- 006_card_setup_flow.sql
-- Add columns to cards table for pre-programmed card setup and flat subscription model

ALTER TABLE cards ADD COLUMN IF NOT EXISTS place_id TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS merchant_email TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'pending';
ALTER TABLE cards ADD COLUMN IF NOT EXISTS subscription_id TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS linked_at TIMESTAMPTZ;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS subscription_status_updated_at TIMESTAMPTZ;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_cards_place_id ON cards(place_id);
CREATE INDEX IF NOT EXISTS idx_cards_merchant_email ON cards(merchant_email);
CREATE INDEX IF NOT EXISTS idx_cards_subscription_id ON cards(subscription_id);
