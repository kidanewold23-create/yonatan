-- =============================================================================
-- Supabase Cron Job Setup for Founders Academy Daily Quiz & Expiration
-- =============================================================================
-- HOW TO USE:
--   1. Open Supabase SQL Editor:
--      https://supabase.com/dashboard/project/acnaidlegwkqcjxbdwra/sql
--   2. Paste this entire script and click "Run"
--
-- WHAT IT DOES:
--   - Enables pg_cron (job scheduler) and pg_net (HTTP requests) extensions
--   - Schedules the quiz & expiration cron job to run every minute
--   - The Edge Function handles the 24-hour send throttle via last_completed_at
--   - Expired subscriptions are automatically cleaned up and users removed from channel
-- =============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Remove existing job if it already exists (safe re-run)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'founders-send-daily-quiz') THEN
    PERFORM cron.unschedule('founders-send-daily-quiz');
    RAISE NOTICE 'Existing cron job removed.';
  END IF;
END $$;

-- 3. Schedule the cron job to run every minute
SELECT cron.schedule(
  'founders-send-daily-quiz',
  '* * * * *',   -- every minute
  $$
    SELECT net.http_post(
      url     := 'https://acnaidlegwkqcjxbdwra.supabase.co/functions/v1/api/cron/send_daily_quiz',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer sb_publishable_pmI9gZu_QwYfq896kFMjUw_GmQe_HPn'
      ),
      body    := '{}'::jsonb
    );
  $$
);

-- 4. Verify — should show the job listed below
SELECT
  jobid,
  jobname,
  schedule,
  active
FROM cron.job
WHERE jobname = 'founders-send-daily-quiz';
