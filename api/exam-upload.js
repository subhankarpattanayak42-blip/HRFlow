/* ═══════════════════════════════════════════════════════════════
   MG3003 — Mid-Term Case Study Submission API (Vercel Serverless)
   Receives a .docx/.pdf upload from the exam page and saves it to a
   PRIVATE Google Drive folder. The folder ID lives ONLY in server env
   vars — it is NEVER sent to the browser.

   Identity: verified server-side from the student's Supabase JWT
   (see api/_exam.js). Deadline: enforced HERE against the fixed
   midnight-Sun cutoff — uploads after that are rejected (403).
   ═══════════════════════════════════════════════════════════════ */

const busboy = require("busboy");
const { verifyIdentity, getAttempt, DEFAULT_EXAM } = require("./_exam");

const ALLOWED_EXT = ["docx", "pdf"];
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB hard cap

function safeName(name) {
  return String(name || "submission").replace(/[^\w.\-]+/g, "_").replace(/_+/g, "_").slice(0, 90);
}

/* Refresh the instructor's OAuth access token (same flow verified in
   scripts/test_exam_upload.js — googleapis' auto-refresh proved unreliable). */
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
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const env = (process && process.env) || {};
  if (!env.EXAMS_DRIVE_FOLDER_ID) return res.status(500).json({ error: "Not configured" });
  if (!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REFRESH_TOKEN)) {
    return res.status(500).json({ error: "Upload service not configured" });
  }

  /* ── 1. Identity: verified server-side from the Supabase JWT ── */
  const who = await verifyIdentity(env, req);
  if (!who.ok) return res.status(who.status).json({ error: who.message });

  /* ── 2. Deadline: authoritative server clock — reject if out of time ── */
  const state = await getAttempt(env, who.authed, who.email, DEFAULT_EXAM);
  if (!state.ok) return res.status(state.status).json({ error: state.message });
  if (state.expired) return res.status(403).json({ error: "🔒 Submissions are closed — the midnight Sunday deadline has passed. Contact your instructor." });

  /* ── 3. Parse the multipart body via busboy ── */
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
  const title = `${who.roll} - ${who.name} - ${stem}.${ext}`;

  try {
    const access = await refreshAccessToken(env); // raises on failure

    // Single-call multipart/related upload: metadata (name + parents) and the
    // file bytes are sent together → created directly inside the private folder.
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

    // 4. Mark this student's attempt as submitted (audit trail).
    try {
      await who.authed.from("exam_attempts").update({ submitted: true })
        .eq("user_email", who.email).eq("exam_code", DEFAULT_EXAM);
    } catch (e) { console.error("mark-submitted failed", e.message); /* non-fatal */ }

    // Return ONLY confirmation + safe echo. No link, no path, no folder id.
    return res.status(200).json({ ok: true, filename: title, size: fileBuf.length });
  } catch (e) {
    console.error("upload error", e.message);
    return res.status(502).json({ error: "Could not save your file. Please try again or raise your hand." });
  }
};