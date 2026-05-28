import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]

import os

def get_sheet_data():
    api_dir = os.path.dirname(os.path.abspath(__file__))
    creds_path = os.path.join(os.path.dirname(api_dir), "credentials.json")

    creds = ServiceAccountCredentials.from_json_keyfile_name(
        creds_path,
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

        name = row[0].strip()
        business_days = row[8].strip()

        if not name or not business_days:
            continue

        programs.append({
    "code": row[1].strip(),
    "name": row[0].strip(),
    "business_days": int(row[8])
})

    return programs