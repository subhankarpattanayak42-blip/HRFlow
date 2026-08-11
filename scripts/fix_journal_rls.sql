-- ═══════════════════════════════════════════════════════════════
-- Fix: Allow students to save journal entries and quiz codes
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Drop the old policy that restricts inserts to admins only
DROP POLICY IF EXISTS "custom scenarios authenticated insert" ON public.custom_scenarios;

-- Create a new policy that allows:
-- 1. Admins to insert any scenario (as before)
-- 2. Students to insert journal entries (_JOURNAL_) and quiz codes (_QUIZCODE_)
CREATE POLICY "custom scenarios authenticated insert" ON public.custom_scenarios
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.uid() = created_by AND public.is_admin())
    OR
    module IN ('_JOURNAL_', '_QUIZCODE_')
  );

-- Verify the policy
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'custom_scenarios' AND cmd = 'INSERT';