import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
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
    creds_json = os.environ.get("GOOGLE_CREDENTIALS")
    if not creds_json:
        creds_path = os.path.join(os.path.dirname(__file__), "backend", "credentials.json")
        if os.path.exists(creds_path):
            creds_json = open(creds_path).read()
    if not creds_json:
        raise RuntimeError("Set GOOGLE_CREDENTIALS env var or place credentials.json in backend/")
    creds = ServiceAccountCredentials.from_json_keyfile_dict(json.loads(creds_json), scope)
    spreadsheet = gspread.authorize(creds).open_by_key(SHEET_KEY)
    resp = spreadsheet.values_batch_get([f"{SHEET_TAB}!{c}:{c}" for c in COLS])
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
            programs.append({"code": code, "name": name, "business_days": int(day)})
        except Exception:
            continue
    return programs


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/leadtime":
            try:
                programs = _fetch_programs()
                body = json.dumps({"data": programs})
                self.send_response(200)
            except Exception as e:
                body = json.dumps({"error": str(e)})
                self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body.encode())
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        print(f"[local] {args[0]}")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Backend running at http://localhost:{port}/api/leadtime")
    HTTPServer(("127.0.0.1", port), Handler).serve_forever()
