/* Shared helpers for the MG3003 exam endpoints (exam-upload.js, exam-state.js).

   Two responsibilities:
   1. VERIFIED identity — the student's Supabase JWT (sent as `Authorization:
      Bearer …`) is checked via auth.getUser; email + display_name come from the
      verified session + profiles table (queried WITH that student's JWT because
      RLS blocks anonymous reads). The browser can never supply identity.
   2. AUTHORITATIVE exam clock — start/deadline live in the `exam_attempts` table
      (server-side), so closing the browser can't re-farm time. `getAttempt`
      returns the student's attempt (auto-creating it on first load).

   Env: SUPABASE_URL, SUPABASE_ANON_KEY, EXAMS_DRIVE_FOLDER_ID.
   EXAMS_DURATION_SECONDS (default 3600) sets the exam length. */
const { createClient } = require("@supabase/supabase-js");

const DEFAULT_EXAM = "midterm-1";

/* The Supabase URL + anon key are PUBLIC (they ship in the frontend HTML), so
   we fall back to them here — the Vercel serverless env may not carry them
   (this project hardcodes them in index.html rather than env). */
const FALLBACK_URL = "https://avzchxohvknqmenrmibz.supabase.co";
const FALLBACK_ANON = "sb_publishable_wlBgsi63ky37oF8Jq4h-_w_WJyNXPC8";

function clients(env, jwt) {
  const url = env.SUPABASE_URL || FALLBACK_URL;
  const anon = env.SUPABASE_ANON_KEY || FALLBACK_ANON;
  return { anon: createClient(url, anon), authed: createClient(url, anon, { global: { headers: { Authorization: `Bearer ${jwt}` } } }) };
}

/* Returns { ok, status, email, name, userId } or { ok:false, status, ... }.
   Rejects non-student accounts (only @silicon.ac.in + test student). */
async function verifyIdentity(env, req) {
  const authHeader = String(req.headers["authorization"] || "");
  const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!jwt) return { ok: false, status: 401, message: "Please log in to HR Flow first, then retry." };

  const { anon, authed } = clients(env, jwt);
  let user = null;
  try {
    const { data, error } = await anon.auth.getUser(jwt);
    if (error || !data.user) throw new Error(error?.message || "unverified");
    user = data.user;
  } catch (e) {
    return { ok: false, status: 401, message: "Log-in check failed. Please re-login to HR Flow and retry." };
  }

  const email = (user.email || "").trim().toLowerCase();
  if (!email.endsWith("@silicon.ac.in") && email !== "student@tech.com") {
    return { ok: false, status: 403, message: "Only MG3003 student accounts can submit." };
  }

  let name = (user.user_metadata?.display_name || "").toString().trim();
  if (!name) {
    try {
      const { data: p } = await authed.from("profiles").select("display_name").eq("id", user.id).single();
      if (p?.display_name) name = String(p.display_name).trim();
    } catch (e) { /* keep fallback */ }
  }
  name = name.replace(/[^\w \-]/g, "").slice(0, 60) || email.split("@")[0];
  const roll = email.split("@")[0];
  return { ok: true, status: 200, jwt, authed, email, name, roll, userId: user.id };
}

/* Get (or create) the student's attempt for `examCode`. Returns:
   { ok, status, attempt, remainingMs, deadlineMs, expired }.
   Auto-creates on first load using the student's own authed client (RLS allows
   insert of own row).
   TAKE-HOME MODE (cyclone concession, 26 Sep 2026): ONE fixed cutoff —
   midnight end of Sunday 27 Sep IST. No per-student countdown; started_at is
   kept only as an audit trail. */
const CUTOFF_IST = "2026-09-27T23:59:00+05:30"; // hard close, server-enforced
async function getAttempt(env, authed, email, examCode = DEFAULT_EXAM) {
  let attempt = null;
  try {
    const { data: rows, error } = await authed
      .from("exam_attempts")
      .select("user_email, started_at, submitted, exam_code")
      .eq("user_email", email)
      .eq("exam_code", examCode)
      .maybeSingle();
    if (error) throw error;
    attempt = rows;
  } catch (e) {
    return { ok: false, status: 503, message: "Exam clock unavailable. Tell the invigilator." };
  }

  if (!attempt) {
    try {
      const { data: ins, error } = await authed
        .from("exam_attempts")
        .insert({ user_email: email, exam_code: examCode, submitted: false })
        .select("user_email, started_at, submitted, exam_code")
        .single();
      if (error) throw error;
      attempt = ins;
    } catch (e) {
      // Race: two rapid tab loads can both try to insert. Fall back to a read.
      try {
        const { data: again } = await authed
          .from("exam_attempts")
          .select("user_email, started_at, submitted, exam_code")
          .eq("user_email", email).eq("exam_code", examCode).maybeSingle();
        if (again) attempt = again;
        else return { ok: false, status: 503, message: "Exam clock unavailable. Tell the invigilator." };
      } catch (e2) {
        return { ok: false, status: 503, message: "Exam clock unavailable. Tell the invigilator." };
      }
    }
  }

  const startedAt = Date.parse(attempt.started_at);
  if (Number.isNaN(startedAt)) {
    return { ok: false, status: 503, message: "Exam clock is out of sync. Tell the invigilator." };
  }
  // Fixed cutoff: midnight Sun 27 Sep IST. Env override EXAMS_CUTOFF_IST wins.
  const deadline = Date.parse(env.EXAMS_CUTOFF_IST || CUTOFF_IST);
  const now = Date.now();
  const remainingMs = Math.max(0, deadline - now);
  const expired = now >= deadline;
  return { ok: true, status: 200, attempt, startedAt, deadline, remainingMs, expired };
}

module.exports = { DEFAULT_EXAM, verifyIdentity, getAttempt, clients };