-- 008_midtrans_payment_ref.sql
-- Switch order payments from Stripe Checkout to Midtrans Snap (QRIS/GoPay/etc).
-- Generalize the payment reference column; Midtrans uses the order_code as
-- transaction id but we also persist the provider's transaction_id on fulfillment.

ALTER TABLE orders RENAME COLUMN stripe_checkout_session_id TO payment_ref;
