# HR Flow Lab (Supabase + Role-Based UI)

Production-oriented HR simulation platform for undergrad learning.

## Current capabilities
- Supabase Auth + Postgres persistence
- Student vs Admin UI separation
- Team simulation sessions with save/resume
- Admin scenario builder
- Admin leaderboard + analytics dashboard
- Admin danger zone actions:
  - Wipe all results
  - Reset all team sessions
  - Wipe all DB values (teams, custom scenarios, results)

## Important security note
- Never store `service_role` keys in source files or frontend code.
- If a secret was exposed, rotate it immediately in Supabase.

## Setup
1. Create Supabase project.
2. Run `/Users/subhankar/Documents/Codex/supabase/schema.sql` in SQL Editor.
3. Open `/Users/subhankar/Documents/Codex/index.html`.
4. Paste Project URL + Publishable/anon key.
5. Connect backend and login.

## Deploy frontend
- Vercel: `/Users/subhankar/Documents/Codex/vercel.json`
- Netlify: `/Users/subhankar/Documents/Codex/netlify.toml`
- GitHub Pages workflow: `/Users/subhankar/Documents/Codex/.github/workflows/deploy-pages.yml`
