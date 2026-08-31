import os
import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

SHEET_KEY = "1hl1S5QGgy2DLf8M1YgldsqUEC-u1hg54K8mD5mZoWw8"
SHEET_TAB = "Current"
COLS = ["A", "B", "I"]

scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive",
]


def handler(request, response):
    try:
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

        response.status_code = 200
        response.headers["Content-Type"] = "application/json"
        response.body = json.dumps({"data": programs})
    except Exception as e:
        response.status_code = 500
        response.headers["Content-Type"] = "application/json"
        response.body = json.dumps({"error": str(e)})
