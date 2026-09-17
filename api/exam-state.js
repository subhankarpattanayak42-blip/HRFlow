/* MG3003 — exam clock API (Vercel Serverless)
   Returns the AUTHORITATIVE remaining time for the signed-in student.
   The page polls this; the browser never computes its own deadline, so a
   student closing/reopening the page cannot re-farm time. */
const { verifyIdentity, getAttempt, DEFAULT_EXAM } = require("./_exam");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (!["GET", "POST"].includes(req.method)) return res.status(405).json({ error: "GET or POST only" });

  const env = (process && process.env) || {};
  if (!env.EXAMS_DRIVE_FOLDER_ID) return res.status(500).json({ error: "Not configured" });

  const who = await verifyIdentity(env, req);
  if (!who.ok) return res.status(who.status).json({ error: who.message });

  const state = await getAttempt(env, who.authed, who.email, DEFAULT_EXAM);
  if (!state.ok) return res.status(state.status).json({ error: state.message });

  return res.status(200).json({
    ok: true,
    email: who.email,
    name: who.name,
    roll: who.roll,
    remainingMs: state.remainingMs,
    deadlineTs: state.deadline,
    startedAt: state.startedAt,
    expired: state.expired,
    submitted: state.attempt.submitted,
  });
};