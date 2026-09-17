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

function clients(env, jwt) {
  const anon = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const authed = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
  return { anon, authed };
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
   insert of own row). */
async function getAttempt(env, authed, email, examCode = DEFAULT_EXAM) {
  const durationSec = parseInt(env.EXAMS_DURATION_SECONDS || "3600", 10);
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
  const deadline = startedAt + durationSec * 1000;
  const now = Date.now();
  const remainingMs = Math.max(0, deadline - now);
  const expired = now >= deadline;
  return { ok: true, status: 200, attempt, startedAt, deadline, remainingMs, expired };
}

module.exports = { DEFAULT_EXAM, verifyIdentity, getAttempt, clients };