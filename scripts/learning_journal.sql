-- ═══════════════════════════════════════════════════════════════
-- MG3003 — Learning Journal table
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS learning_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  display_name TEXT,
  session_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE learning_journal ENABLE ROW LEVEL SECURITY;

-- Students can read their own entries
CREATE POLICY "Students read own entries"
  ON learning_journal FOR SELECT
  USING (auth.uid() = user_id);

-- Students can insert their own entries
CREATE POLICY "Students insert own entries"
  ON learning_journal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Students can update their own entries
CREATE POLICY "Students update own entries"
  ON learning_journal FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin can read all entries (admin check via profiles table)
CREATE POLICY "Admin read all entries"
  ON learning_journal FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin can delete any entry
CREATE POLICY "Admin delete entries"
  ON learning_journal FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Expose to REST API
GRANT ALL ON learning_journal TO authenticated, service_role;

-- Verify
SELECT table_name FROM information_schema.tables WHERE table_name = 'learning_journal';