#!/usr/bin/env node
const fs = require("fs");
const token = JSON.parse(fs.readFileSync(process.env.HOME + "/.hermes/google_token.json", "utf8"));
const FOLDER = "1eqy8SJ5T_M8HPqk32Dv2tOQukGJ7eyC6";

async function refresh() {
  const b = new URLSearchParams({
    grant_type: "refresh_token", refresh_token: token.refresh_token,
    client_id: token.client_id, client_secret: token.client_secret }).toString();
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: b });
  const j = await r.json();
  if (!j.access_token) throw new Error("refresh failed");
  return j.access_token;
}

(async () => {
  const access = await refresh();
  // list live (non-trashed) files in the folder
  const root = await fetch(`https://www.googleapis.com/drive/v3/files?q='${FOLDER}' in parents and trashed=false&fields=files(id,name,mimeType,createdTime)&pageSize=100`, {
    headers: { Authorization: `Bearer ${access}` } }).then(r => r.json());
  console.log("LIVE files in MidTerm-Case-Study folder:", root.files.length);
  for (const f of root.files) console.log(" -", f.name, "|", f.mimeType);
  // folder identity
  const meta = await fetch(`https://www.googleapis.com/drive/v3/files/${FOLDER}?fields=id,name,owners(emailAddress)`, {
    headers: { Authorization: `Bearer ${access}` } }).then(r => r.json());
  console.log("FOLDER:", meta.name, "| owned by:", (meta.owners||[]).map(o=>o.emailAddress).join(","), "| id:", meta.id);
})().catch(e => { console.error("FAILED:", e.message); process.exit(1); });