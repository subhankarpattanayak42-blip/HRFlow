#!/usr/bin/env python3
"""Create the private Mid-Term exam submission folder under 05-Admin-Instructor.
Reads the real Google token at ~/.hermes/google_token.json directly (the aihra
profile's google_api.py wrapper resolves a different path). Prints the folder ID.
"""
import json, os, sys
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

TOKEN = os.path.expanduser("~/.hermes/google_token.json")
CN = os.path.expanduser("~/.hermes/google_client_secret.json")

with open(TOKEN) as f:
    info = json.load(f)
with open(CN) as f:
    cseed = json.load(f)
info["client_id"] = info.get("client_id") or cseed["installed"]["client_id"]
info["client_secret"] = info.get("client_secret") or cseed["installed"]["client_secret"]
info["token_uri"] = info.get("token_uri") or cseed["installed"]["token_uri"]

creds = Credentials.from_authorized_user_info(info, ["https://www.googleapis.com/auth/drive"])
creds = creds.refresh(Request()) if False else creds

from google.auth.transport.requests import Request
if creds.expired and creds.refresh_token:
    creds.refresh(Request())

service = build("drive", "v3", credentials=creds)

# Locate 05-Admin-Instructor under the master folder
master = "1GRHwPgOFTP9x9xbfOMm0DV3w6Zb30Wqs"
admin = None
res = service.files().list(
    q="'%s' in parents and mimeType='application/vnd.google-apps.folder' and name='05-Admin-Instructor'" % master,
    fields="files(id,name)", pageSize=10).execute()
for fl in res.get("files", []):
    admin = fl["id"]; print("Found 05-Admin-Instructor:", fl["id"])

if not admin:
    print("ERROR: 05-Admin-Instructor folder not found under master"); sys.exit(1)

# Create the exam submissions subfolder
meta = {
    "name": "MidTerm-Case-Study-Submissions-" + "2026",
    "mimeType": "application/vnd.google-apps.folder",
    "parents": [admin],
}
created = service.files().create(body=meta, fields="id,name,webViewLink").execute()
print("CREATED:", json.dumps(created))