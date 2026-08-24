-- 009_analytics_aggregates.sql
-- Replaces unbounded interaction-row fetches in JS with SQL aggregates.
-- Applied via Supabase SQL editor or CLI before deploying the app version that calls these RPCs.

-- Functional index for merchant_email case-insensitive lookups
CREATE INDEX IF NOT EXISTS idx_cards_merchant_email_lower ON public.cards(lower(merchant_email));

-- Per-card analytics overview (single row of counts instead of fetching all interactions)
CREATE OR REPLACE FUNCTION public.get_card_analytics(p_card_id TEXT)
RETURNS TABLE (
    today BIGINT,
    yesterday BIGINT,
    last_7_days BIGINT,
    last_30_days BIGINT,
    all_time BIGINT,
    qr_total BIGINT,
    nfc_total BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        COUNT(*) FILTER (WHERE i.timestamp >= date_trunc('day', now())),
        COUNT(*) FILTER (WHERE i.timestamp >= date_trunc('day', now() - INTERVAL '1 day')
                         AND i.timestamp < date_trunc('day', now())),
        COUNT(*) FILTER (WHERE i.timestamp >= now() - INTERVAL '7 days'),
        COUNT(*) FILTER (WHERE i.timestamp >= now() - INTERVAL '30 days'),
        COUNT(*),
        COUNT(*) FILTER (WHERE i.source = 'qr'),
        COUNT(*) FILTER (WHERE i.source = 'nfc')
    FROM public.interactions i
    WHERE i.card_id = p_card_id
      AND i.is_bot = 0;
$$;

-- Multi-card stats for an owner email (one grouped query instead of N nested selects)
CREATE OR REPLACE FUNCTION public.get_cards_stats_by_email(p_email TEXT)
RETURNS TABLE (
    card_id TEXT,
    today BIGINT,
    yesterday BIGINT,
    last_7_days BIGINT,
    last_30_days BIGINT,
    all_time BIGINT,
    qr BIGINT,
    nfc BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        c.id,
        COUNT(i.id) FILTER (WHERE i.timestamp >= date_trunc('day', now())),
        COUNT(i.id) FILTER (WHERE i.timestamp >= date_trunc('day', now() - INTERVAL '1 day')
                            AND i.timestamp < date_trunc('day', now())),
        COUNT(i.id) FILTER (WHERE i.timestamp >= now() - INTERVAL '7 days'),
        COUNT(i.id) FILTER (WHERE i.timestamp >= now() - INTERVAL '30 days'),
        COUNT(i.id),
        COUNT(i.id) FILTER (WHERE i.source = 'qr'),
        COUNT(i.id) FILTER (WHERE i.source = 'nfc')
    FROM public.cards c
    LEFT JOIN public.interactions i
        ON i.card_id = c.id AND i.is_bot = 0
    WHERE lower(c.merchant_email) = lower(p_email)
    GROUP BY c.id;
$$;
