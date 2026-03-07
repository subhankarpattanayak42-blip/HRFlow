# Supabase Setup (Production-Ready Data Layer)

## 1. Create project
1. Go to Supabase and create a new project.
2. In `Project Settings -> API`, copy:
- `Project URL`
- `anon public key`

## 2. Apply database schema
1. Open SQL Editor in Supabase.
2. Paste and run:
- `/Users/subhankar/Documents/Codex/supabase/schema.sql`
3. If you already ran an older schema version, run the latest file again to apply admin delete policies.

## 3. Auth settings
1. In `Authentication -> Providers -> Email`, enable Email provider.
2. For quick testing, disable email confirmation.
3. For production, keep confirmation enabled and configure SMTP.

## 4. Run app
1. Open `/Users/subhankar/Documents/Codex/index.html`.
2. In `Supabase Connection`, paste URL + anon key.
3. Click `Connect Backend`.
4. Register an admin user and a student user.
5. Admin and Student now see different UI panels.

## 5. Promote admin users safely
Current UI lets role be selected during signup. For production control, run SQL manually:
```sql
update public.profiles
set role = 'admin'
where id = '<user-uuid>';
```

## 6. Admin data wipe actions
After login as admin, use `Faculty Admin -> Danger Zone` in the app to:
1. Wipe results
2. Reset all team sessions
3. Wipe teams + custom scenarios + results

## 7. Deployment note
Because this is static frontend + Supabase backend, deploy the frontend anywhere (Vercel/Netlify/GitHub Pages) and reuse the same Supabase project.

## 8. Recommended next hardening
1. Move role checks to DB policies (JWT custom claims or role table checks).
2. Restrict team update policies by class/team membership.
3. Add server-side API layer for admin operations and exports.
