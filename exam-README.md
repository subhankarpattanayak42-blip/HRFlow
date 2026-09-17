# MG3003 Mid-Term Case Study — Submission

A one-hour, case-study exam page that records each student's Word/PDF answer
directly into a **private** Google Drive folder. The student never sees the
folder, its ID, or any drive link — only a "submitted ✅" confirmation.

## How it works

```
Student                            Vercel /exam              Vercel /api/exam-upload          Google Drive
───────┬──────────────────────────────────────────────────────────────────────────────────────────────┐
       │ opens hr-flow-liart.vercel.app/exam (1hr timer + case)                                      │
       │ pre-fills their name/email from the HR Flow login session                                   │
       │ picks a .docx/.pdf and hits Submit                                                          │
       └──────────────────── upload (multipart) ─────────────────────────►                           │
                                                                                                     │
                                     │ reads x-student-email/name headers                             │
                                     │ refreshes Google OAuth token (server-side)                    │
                                     │ single-call multipart upload  ─────────────────────────────►  │
                                     │ (metadata + bytes together)       │  file lands in            │
                                     │ returns {ok,filename} ONLY         │  05-Admin-Instructor/     │
                                     │                                  │  MidTerm-Case-Study-…/     │
                                     └──────────────────────────────────►  (private, never shared)  │
```
The Drive folder ID + Google OAuth credentials exist ONLY as Vercel env vars.
The browser never receives them — so a student can't discover or tamper with
the submission location.

### Student identity — VERIFIED server-side
The exam page sends the student's **Supabase login JWT** as a `Bearer` token.
The endpoint:
1. verifies the token via `supabase.auth.getUser(jwt)` — the login must be real;
2. reads the verified email + display name from the `profiles` table (queried
   **as that student's JWT**, because RLS blocks anonymous reads);
3. derives the roll number (email local-part, e.g. `cse.24bcsg59`);
4. allows only `@silicon.ac.in` accounts (plus `student@tech.com` test).

The browser can no longer supply an identity (old header scheme removed), so a
student can't spoof another's submission. The resulting Drive filename is:
`<roll> - <display name> - <original stem>.<ext>` (e.g.
`cse.24bcsg59 - Anikesh Ransingh - My Answers final.docx`).

## Files added

| File | Role |
|------|------|
| `exam.html` | The exam page (served as `https://hr-flow-liart.vercel.app/exam`) |
| `api/exam-upload.js` | Vercel serverless function that saves uploads to Drive |
| `api/exam-state.js` | Serverless **authoritative clock** (returns remaining time) |
| `api/_exam.js` | Shared: JWT verification + exam-clock logic |
| `supabase/exam_attempts.sql` | **REQUIRED SQL** — run in Supabase SQL Editor once |
| `scripts/exam_drive_create.py` | (one-time) created the private Drive folder |
| `scripts/test_exam_upload.js` | (dev) end-to-end proof against the real folder |

## ⚠️ Do this FIRST — create the exam-clock table (once)

The server-enforced timer needs a table. **Run `supabase/exam_attempts.sql` in the
Supabase SQL Editor** (Supabase → Dashboard → SQL Editor → paste → Run). The service
role key can't create tables via REST (`PGRST205`), so this manual step is required.
Until it's run, `/api/exam-state` returns "Exam clock unavailable" and the page shows
a fallback (client timer) with a warning banner — the server-verified deadline is
only active after the SQL. Verified: `PGRST205 Could not find the table` was the
exact error before running; the code is correct.

After running the SQL, verify:
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://hr-flow-liart.vercel.app/api/exam-state
# with an Authorization: Bearer <student jwt> header → 200 { ok, remainingMs, deadlineTs }
```

## Folder (already created)

- Parent: `05-Admin-Instructor` (private)
- **Folder ID `EXAMS_DRIVE_FOLDER_ID` = `1eqy8SJ5T_M8HPqk32Dv2tOQukGJ7eyC6`**
- It is NOT shared with students. Do not share it.

## Vercel env vars to set

Vercel → Project (hr-flow-liart) → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `EXAMS_DRIVE_FOLDER_ID` | `1eqy8SJ5T_M8HPqk32Dv2tOQukGJ7eyC6` |
| `GOOGLE_CLIENT_ID` | from `~/.hermes/google_token.json` (`client_id`) |
| `GOOGLE_CLIENT_SECRET` | from `~/.hermes/google_token.json` (`client_secret`) |
| `GOOGLE_REFRESH_TOKEN` | from `~/.hermes/google_token.json` (`refresh_token`) |

> **Security note:** this uses the instructor's personal OAuth refresh token, so
> uploaded files are owned by subu@techsambad.com. For a production/end-term exam,
> prefer a dedicated **Google Service Account** with Editor access on just the one
> folder (scoped `drive.file`), and swap it in — the endpoint can read the token
> values from the same env var we already use.

## Deploy

```bash
cd ~/Documents/MG3003-Course/HRFlow
git add exam.html api/exam-upload.js package.json package-lock.json
git commit -m "Add mid-term case study exam: /exam page + private Drive upload"
git push origin main        # Vercel auto-deploys
```

Verify:
```bash
curl -sL -o /dev/null -w "%{http_code}\n" https://hr-flow-liart.vercel.app/exam        # 200
# and a real upload (see scripts/test_exam_upload.js for the exact flow)
```

## Customising the case

Edit `exam.html` → the block between the two comment markers
(`EDIT ME: paste the actual case text…`), replacing the content inside
`<div class="case" id="caseBody">…</div>`. The timer length is
`const DURATION = 60 * 60;` (seconds).

## Gotchas learned while building (verified live)

- `googleapis` node client's OAuth **auto-refresh is unreliable** — it threw
  "Invalid Credentials" on an expired access token. So the endpoint refreshes the
  token itself via `oauth2.googleapis.com/token` (plain fetch) — proven working.
- **Two-step upload (media upload, then PATCH to add `parents`) returns 403** on
  the PATCH. Use the **single `uploadType=multipart`** multipart/related call with
  name + parents in the JSON part — verified successfully.
- The aihra Google wrapper resolves the token to a different path
  (`profiles/aihra/google_token.json`) than the real token
  (`~/.hermes/google_token.json`); build the client directly against the real path.