#!/usr/bin/env node
/* Full simulation of api/exam-upload.js identity path (no upload — just the
   identity + filename result), proving real student names resolve to the
   exact Drive filename the endpoint will produce. */
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const env = {};
for (const l of fs.readFileSync(process.env.HOME + "/Documents/MG3003-Course/hris-teaching-aids/.env.supabase", "utf8").split("\n")) {
  const i = l.indexOf("="); if (i > 0) env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
}

(async () => {
  const sb = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const email = "student@tech.com", password = "mg3003@2026";
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw new Error("signin: " + error.message);
  const jwt = data.session.access_token;
  console.log("1) signed in as", data.user.email);

  // exact endpoint path
  const v = await sb.auth.getUser(jwt); if (v.error) throw new Error(v.error.message);
  const verifiedEmail = v.data.user.email.trim().toLowerCase();
  console.log("2) getUser verified:", verifiedEmail);

  const authed = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: "Bearer " + jwt } } });
  let name = (v.data.user.user_metadata?.display_name || "").toString().trim();
  if (!name) {
    const p = await authed.from("profiles").select("display_name").eq("id", v.data.user.id).single();
    if (p.data?.display_name) name = p.data.display_name.trim();
  }
  name = name.replace(/[^\w \-]/g, "").slice(0, 60) || verifiedEmail.split("@")[0];
  const roll = verifiedEmail.split("@")[0];
  console.log("3) resolved name:", JSON.stringify(name), "| roll:", roll);

  for (const orig of ["My Answers final.docx", "brief.pdf"]) {
    const ext = orig.split(".").pop().toLowerCase();
    const stem = orig.replace(/\.(docx|pdf)$/i, "");
    console.log(`4) "${orig}"  →  saved as:  ${roll} - ${name} - ${stem}.${ext}`);
  }
  const allowed = verifiedEmail.endsWith("@silicon.ac.in") || verifiedEmail === "student@tech.com";
  console.log("5) domain gate passes:", allowed);
})().catch(e => { console.error("FAILED:", e.message); process.exit(1); });