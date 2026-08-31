import os
import json
from http.server import BaseHTTPRequestHandler
import gspread
from oauth2client.service_account import ServiceAccountCredentials

SHEET_KEY = "1hl1S5QGgy2DLf8M1YgldsqUEC-u1hg54K8mD5mZoWw8"
SHEET_TAB = "Current"
COLS = ["A", "B", "I"]

scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive",
]


def _fetch_programs():
    creds_json = os.environ["GOOGLE_CREDENTIALS"]
    creds = ServiceAccountCredentials.from_json_keyfile_dict(
        json.loads(creds_json), scope
    )
    spreadsheet = gspread.authorize(creds).open_by_key(SHEET_KEY)

    resp = spreadsheet.values_batch_get(
        [f"{SHEET_TAB}!{c}:{c}" for c in COLS]
    )
    columns = {}
    for vr in resp.get("valueRanges", []):
        cell = vr["range"].split("!")[-1].split(":")[0]
        columns[cell.rstrip("0123456789")] = vr.get("values", [])

    names = columns.get("A", [])
    codes = columns.get("B", [])
    days = columns.get("I", [])

    programs = []
    n = max(len(names), len(codes), len(days))
    for i in range(1, n):
        try:
            name = names[i][0].strip() if i < len(names) and names[i] else ""
            code = codes[i][0].strip() if i < len(codes) and codes[i] else ""
            day = days[i][0].strip() if i < len(days) and days[i] else ""
            if not name or not day:
                continue
            programs.append({
                "code": code,
                "name": name,
                "business_days": int(day),
            })
        except Exception:
            continue

    return programs


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            programs = _fetch_programs()
            body = json.dumps({"data": programs})
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body.encode())
        except Exception as e:
            body = json.dumps({"error": str(e)})
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(body.encode())

    def log_message(self, format, *args):
        pass
