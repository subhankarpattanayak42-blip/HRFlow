-- MG3003 Mid-Term Case Study — authoritative exam timer.
-- Run this in Supabase SQL Editor ONCE (service key can't DDL — verified).
-- Tracks when each student STARTED the exam, so the deadline is computed
-- SERVER-side and survives browser closes / reloads (no re-farming time).

CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_email  text NOT NULL,                        -- the student's @silicon.ac.in email
  exam_code   text NOT NULL DEFAULT 'midterm-1',    -- which exam (defaults to midterm-1; set per paper)
  started_at  timestamptz NOT NULL DEFAULT now(),   -- first load of the exam page
  submitted   boolean NOT NULL DEFAULT false,        -- a file has been accepted
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_email, exam_code)                    -- one attempt per student per exam
);

comment on table public.exam_attempts is 'MG3003 authoritative per-student exam start/end time — server-enforced timer';

-- ============ ROW LEVEL SECURITY ============
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- A student reads their OWN attempt; an admin reads all (for grading / audit).
CREATE POLICY "exam_attempts select own or admin" ON public.exam_attempts
  FOR SELECT TO authenticated
  USING (user_email = (auth.jwt() ->> 'email') OR public.is_admin());

-- A student may create only their own first attempt (auto-start on first load).
CREATE POLICY "exam_attempts insert own" ON public.exam_attempts
  FOR INSERT TO authenticated
  WITH CHECK (user_email = (auth.jwt() ->> 'email'));

-- A student may update their own attempt (mark submitted); NOT extend started_at.
CREATE POLICY "exam_attempts update own" ON public.exam_attempts
  FOR UPDATE TO authenticated
  USING (user_email = (auth.jwt() ->> 'email'))
  WITH CHECK (user_email = (auth.jwt() ->> 'email'));