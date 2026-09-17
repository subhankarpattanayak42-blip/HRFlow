#!/usr/bin/env node
/* Verify single-call multipart/related upload (name + parents set at creation).
   This is the approach the endpoint should use — avoids the PATCH-move 403. */
const fs = require("fs");
const token = JSON.parse(fs.readFileSync(process.env.HOME + "/.hermes/google_token.json", "utf8"));
const FOLDER = process.env.EXAMS_DRIVE_FOLDER_ID;
if (!FOLDER) { console.error("set EXAMS_DRIVE_FOLDER_ID"); process.exit(1); }

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
  const boundary = "mg3003exam" + Date.now();
  const meta = Buffer.from(JSON.stringify({ name: "Test Student - _MULTIPART_PROOF.docx", parents: [FOLDER] }));
  const file = Buffer.from("PK\x03\x04 multipart-path-proof-docx");
  const CRLF = "\r\n";
  const body = Buffer.concat([
    Buffer.from(`--${boundary}${CRLF}`),
    Buffer.from(`Content-Type: application/json; charset=UTF-8${CRLF}${CRLF}`), meta,
    Buffer.from(`${CRLF}--${boundary}${CRLF}`),
    Buffer.from(`Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document${CRLF}${CRLF}`), file,
    Buffer.from(`${CRLF}--${boundary}--${CRLF}`),
  ]);
  const r = await fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,parents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access}`, "Content-Type": `multipart/related; boundary=${boundary}` },
    body,
  });
  const j = await r.json();
  console.log("STATUS", r.status);
  console.log("id=", j.id, "name=", j.name, "inFolder=", (j.parents||[]).includes(FOLDER));
  if (j.id && (j.parents||[]).includes(FOLDER)) {
    // verify read-back
    const list = await fetch(`https://www.googleapis.com/drive/v3/files?q='${FOLDER}' in parents and name='Test Student - _MULTIPART_PROOF.docx'&fields=files(id,name)`, {
      headers: { Authorization: `Bearer ${access}` } }).then(r => r.json());
    console.log("Read-back:", list.files.length, "->", list.files.map(f=>f.name).join(","));
    // cleanup
    await fetch(`https://www.googleapis.com/drive/v3/files/${j.id}`, {
      method: "PATCH", headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
      body: JSON.stringify({ trashed: true }) });
    const after = await fetch(`https://www.googleapis.com/drive/v3/files?q='${FOLDER}' in parents and trashed=false and name='Test Student - _MULTIPART_PROOF.docx'&fields=files(id)`, {
      headers: { Authorization: `Bearer ${access}` } }).then(r=>r.json());
    console.log("after cleanup live:", after.files.length, after.files.length===0 ? "CLEAN ✅" : "WARN");
  } else {
    console.log("FULL RESP:", JSON.stringify(j).slice(0,300));
  }
})().catch(e => { console.error("FAILED:", e.message); process.exit(1); });