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
  const AUTH = { Authorization: `Bearer ${access}` };
  // Who can see the folder? (permissions + link sharing settings)
  const perms = await fetch(`https://www.googleapis.com/drive/v3/files/${FOLDER}/permissions?fields=permissions(id,type,role,emailAddress,domain,allowFileDiscovery)`, { headers: AUTH }).then(r => r.json());
  console.log("=== FOLDER PERMISSIONS ===");
  for (const p of perms.permissions || []) console.log(`type=${p.type} role=${p.role} email=${p.emailAddress||'-'} domain=${p.domain||'-'} allowDiscovery=${p.allowFileDiscovery}`);
  if (!(perms.permissions||[]).length) console.log("  (no explicit permissions list returned)");
  // Is it shared 'anyone with link'? (shared = true means link-shared to someone/anyone)
  const meta = await fetch(`https://www.googleapis.com/drive/v3/files/${FOLDER}?fields=id,name,shared,ownedByMe,driveId,capabilities`, { headers: AUTH }).then(r => r.json());
  console.log("=== FOLDER META ===");
  console.log("name:", meta.name);
  console.log("shared (link-sharing on):", meta.shared);
  console.log("ownedByMe:", meta.ownedByMe);
})().catch(e => { console.error("FAILED:", e.message); process.exit(1); });