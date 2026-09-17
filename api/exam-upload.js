/* ═══════════════════════════════════════════════════════════════
   MG3003 — Mid-Term Case Study Submission API (Vercel Serverless)
   Receives a .docx/.pdf upload from the exam page and saves it to a
   PRIVATE Google Drive folder. The folder ID lives ONLY in server env
   vars — it is NEVER sent to the browser. The student sees a plain
   success/failure response, never any Drive path or link.

   Auth: OAuth refresh token (the instructor's existing token has drive
   scope + refresh_token). Refreshed manually via oauth2.googleapis.com
   — googleapis' auto-refresh proved unreliable, so we don't use it.

   Required env (Vercel → Project → Settings → Environment Variables):
     EXAMS_DRIVE_FOLDER_ID  = private submission folder id
     GOOGLE_CLIENT_ID       = from ~/.hermes/google_token.json
     GOOGLE_CLIENT_SECRET   = from ~/.hermes/google_token.json
     GOOGLE_REFRESH_TOKEN   = from ~/.hermes/google_token.json
   ═══════════════════════════════════════════════════════════════ */

const busboy = require("busboy");

const ALLOWED_EXT = ["docx", "pdf"];
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB hard cap

function safeName(name) {
  return String(name || "submission").replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_").slice(0, 90);
}

/* Refresh the instructor's OAuth access token (same flow verified in
   scripts/test_exam_upload.js). */
async function refreshAccessToken(env) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: env.GOOGLE_REFRESH_TOKEN,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
  }).toString();
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("token refresh failed: " + JSON.stringify(j).slice(0, 200));
  return j.access_token;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-student-email, x-student-name");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const env = (process && process.env) || {};
  if (!env.EXAMS_DRIVE_FOLDER_ID) return res.status(500).json({ error: "Not configured" });
  if (!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REFRESH_TOKEN)) {
    return res.status(500).json({ error: "Upload service not configured" });
  }

  /* ── Identity: VERIFIED server-side from the student's Supabase login token.
     The browser's plain-text email/name headers are treated as untrusted display
     hints only — the authoritative identity comes from the signed JWT. ── */
  const authHeader = String(req.headers["authorization"] || "");
  const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  if (!jwt) return res.status(401).json({ error: "Please log in to HR Flow first, then retry." });

  const supabase = require("@supabase/supabase-js").createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  let sessionUser = null;
  try {
    const { data, error } = await supabase.auth.getUser(jwt);
    if (error || !data.user) throw new Error(error?.message || "unverified");
    sessionUser = data.user;
  } catch (e) {
    console.error("supabase verify error", e.message);
    return res.status(401).json({ error: "Log-in check failed. Please re-login to HR Flow and retry." });
  }

  /* RLS blocks anonymous `profiles` reads — we must query as the student, so
     re-instantiate the client with their JWT as the bearer header (verified
     working: anon→0 rows, authed→real display_name). */
  const authedSupabase = require("@supabase/supabase-js").createClient(
    env.SUPABASE_URL, env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${jwt}` } } },
  );
  const verifiedEmail = (sessionUser.email || "").trim().toLowerCase();
  /* Real display name from the profiles table (as the app does); falls back to
     the email local-part if missing. */
  let verifiedName = (sessionUser.user_metadata?.display_name || "").toString().trim();
  if (!verifiedName) {
    try {
      const { data: p } = await authedSupabase.from("profiles").select("display_name").eq("id", sessionUser.id).single();
      if (p?.display_name) verifiedName = String(p.display_name).trim();
    } catch (e) { /* keep fallback */ }
  }
  verifiedName = verifiedName.replace(/[^\w \-]/g, "").slice(0, 60);
  if (!verifiedName) verifiedName = verifiedEmail.split("@")[0];
  const roll = verifiedEmail.split("@")[0]; // e.g. cse.24bcsg59 — the student's roll id
  if (!verifiedEmail.endsWith("@silicon.ac.in") && verifiedEmail !== "student@tech.com") {
    return res.status(403).json({ error: "Only MG3003 student accounts can submit." });
  }

  /* ── Parse the multipart body via busboy ── */
  const bb = busboy({ headers: req.headers, limits: { fileSize: MAX_BYTES, files: 1 } });
  let fileBuf = null;
  let fileName = "";
  let fileMime = "";
  let tooBig = false;

  bb.on("file", (field, file, info) => {
    fileName = safeName(info.filename);
    fileMime = (info.mimeType || "application/octet-stream").toLowerCase();
    const chunks = [];
    file.on("data", (d) => chunks.push(d));
    file.on("limit", () => { tooBig = true; file.resume(); });
    file.on("end", () => { fileBuf = Buffer.concat(chunks); });
  });
  bb.on("error", (e) => { console.error("busboy error", e.message); });
  req.pipe(bb);
  await new Promise((resolve) => bb.on("close", resolve));

  if (tooBig) return res.status(413).json({ error: `File exceeds the ${MAX_BYTES / 1048576} MB limit.` });
  if (!fileBuf) return res.status(400).json({ error: "No file received." });

  const ext = fileName.split(".").pop().toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) return res.status(400).json({ error: "Only Word (.docx) or PDF files are accepted." });

  /* Filename leads with the VERIFIED roll number (email local-part) so every
     submission is uniquely attributable and sortable, e.g.:
     "cse.24bcsg59 - Anikesh Ransingh - MidTerm-Answers.docx" */
  const stem = fileName.replace(/\.(docx|pdf)$/i, "");
  const title = `${roll} - ${verifiedName} - ${stem}.${ext}`;

  try {
    const access = await refreshAccessToken(env); // raises on failure

    // Single-call multipart/related upload: metadata (name + parents) and the
    // file bytes are sent together, so the file is created directly inside the
    // private folder with its display name — no separate move step needed.
    const boundary = "mg3003exam" + Date.now() + String(Math.random()).slice(2, 10);
    const CRLF = "\r\n";
    const meta = Buffer.from(JSON.stringify({ name: title, parents: [env.EXAMS_DRIVE_FOLDER_ID] }));
    const body = Buffer.concat([
      Buffer.from(`--${boundary}${CRLF}`),
      Buffer.from(`Content-Type: application/json; charset=UTF-8${CRLF}${CRLF}`), meta,
      Buffer.from(`${CRLF}--${boundary}${CRLF}`),
      Buffer.from(`Content-Type: ${fileMime}${CRLF}${CRLF}`), fileBuf,
      Buffer.from(`${CRLF}--${boundary}--${CRLF}`),
    ]);

    const upRes = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,parents",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${access}`, "Content-Type": `multipart/related; boundary=${boundary}` },
        body,
      }
    );
    const upJson = await upRes.json();
    if (!upRes.ok || !upJson.id || !(upJson.parents || []).includes(env.EXAMS_DRIVE_FOLDER_ID)) {
      throw new Error("drive upload failed: " + JSON.stringify(upJson).slice(0, 200));
    }

    // Return ONLY confirmation + safe echo. No link, no path, no folder id.
    return res.status(200).json({ ok: true, filename: title, size: fileBuf.length });
  } catch (e) {
    console.error("upload error", e.message);
    return res.status(502).json({ error: "Could not save your file. Please try again or raise your hand." });
  }
};