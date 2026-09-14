-- MG3003 Individual Portfolio links — run in Supabase SQL Editor (once)
-- Each student chooses ONE portfolio destination:
--   'drive'   → their existing personal Drive folder (default, no URL needed)
--   'github'  → a GitHub repo URL they provide
--   'website' → a website/portfolio URL they provide
-- Editable anytime until end of course (upsert by user_email).
-- The app NEVER writes 'url' for drive (uses the hardcoded PORTFOLIO_FOLDERS map).

CREATE TABLE IF NOT EXISTS public.portfolio_links (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_email     text NOT NULL,                       -- the student's Silicon University email
  portfolio_type text NOT NULL DEFAULT 'drive',       -- 'drive' | 'github' | 'website'
  url            text,                                -- GitHub/website link; NULL for drive
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_email)
);

comment on table public.portfolio_links is 'MG3003 individual portfolio destination (drive | github | website) — one per student';

-- ============ ROW LEVEL SECURITY ============
ALTER TABLE public.portfolio_links ENABLE ROW LEVEL SECURITY;

-- A student reads their OWN row; an admin reads every student's row (for grading).
CREATE POLICY "portfolio select own or admin" ON public.portfolio_links
  FOR SELECT TO authenticated
  USING (user_email = (auth.jwt() ->> 'email') OR public.is_admin());

-- Students may insert only their own row (first-time save).
CREATE POLICY "portfolio insert own" ON public.portfolio_links
  FOR INSERT TO authenticated
  WITH CHECK (user_email = (auth.jwt() ->> 'email'));

-- Students may overwrite their own row (editable until end of course).
CREATE POLICY "portfolio update own" ON public.portfolio_links
  FOR UPDATE TO authenticated
  USING (user_email = (auth.jwt() ->> 'email'))
  WITH CHECK (user_email = (auth.jwt() ->> 'email'));

-- Admin/service can do anything (service_role bypasses RLS by default).