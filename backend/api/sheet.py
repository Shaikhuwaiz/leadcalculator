import os
import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]

def get_sheet_data():

    creds = ServiceAccountCredentials.from_json_keyfile_dict(
        json.loads(os.environ["GOOGLE_CREDENTIALS"]),
        scope
    )

    client = gspread.authorize(creds)

    spreadsheet = client.open_by_url(
        "https://docs.google.com/spreadsheets/d/1hl1S5QGgy2DLf8M1YgldsqUEC-u1hg54K8mD5mZoWw8/edit#gid=1031343280"
    )

    worksheet = spreadsheet.worksheet("Current")

    rows = worksheet.get("A:I")

    programs = []

    for row in rows[1:]:
        if len(row) < 9:
            continue

        if not row[0].strip() or not row[8].strip():
            continue

        programs.append({
            "code": row[1].strip(),
            "name": row[0].strip(),
            "business_days": int(row[8]),
        })

    return programs