import os
import json
import time
import threading
import logging
from pathlib import Path
import gspread
from oauth2client.service_account import ServiceAccountCredentials

logger = logging.getLogger(__name__)

# When running in production you may set SHEET_CACHE_PATH and SHEET_CACHE_TTL
CACHE_PATH = Path(os.environ.get("SHEET_CACHE_PATH", "./.sheet_cache.json"))
CACHE_TTL = int(os.environ.get("SHEET_CACHE_TTL", "300"))  # seconds

# Redis connection settings. Leave REDIS_URL empty to use host/port/username/password.
REDIS_URL = os.environ.get("REDIS_URL", "")
REDIS_HOST = os.environ.get("REDIS_HOST", "127.0.0.1")
REDIS_PORT = int(os.environ.get("REDIS_PORT", "6379"))
REDIS_USERNAME = os.environ.get("REDIS_USERNAME", "")
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD", "")
REDIS_DB = int(os.environ.get("REDIS_DB", "0"))
REDIS_KEY = os.environ.get("SHEET_CACHE_REDIS_KEY", "leadtime:sheet_programs")
REDIS_MAX_STALE = int(os.environ.get("SHEET_CACHE_MAX_STALE", str(CACHE_TTL * 4)))  # keep stale data available for background refresh

scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]

# In-memory cache: avoids disk reads on every request
_mem_cache = {"ts": 0, "programs": None}
_mem_lock = threading.Lock()

# Lazy Redis client; shared so multiple workers/processes can serve the same cache.
_redis_client = None
_redis_client_lock = threading.Lock()


def _get_redis():
    """Return a connected Redis client, or None if unavailable."""
    global _redis_client
    if _redis_client is not None:
        return _redis_client
    try:
        import redis
    except Exception:
        return None

    with _redis_client_lock:
        if _redis_client is not None:
            return _redis_client
        try:
            kwargs = {
                "socket_connect_timeout": 1,
                "socket_timeout": 1,
                "decode_responses": True,
            }
            # Same pattern as the basic connection example:
            # redis.Redis(host=..., port=..., username=..., password=...)
            client = (
                redis.Redis.from_url(REDIS_URL, **kwargs)
                if REDIS_URL
                else redis.Redis(
                    host=REDIS_HOST,
                    port=REDIS_PORT,
                    db=REDIS_DB,
                    username=REDIS_USERNAME or None,
                    password=REDIS_PASSWORD or None,
                    **kwargs,
                )
            )
            client.ping()
            _redis_client = client
            return _redis_client
        except Exception as e:
            logger.warning("Redis unavailable, falling back to local cache: %s", e)
            return None


def _write_cache(programs):
    """Write to in-memory, Redis, and file cache."""
    try:
        now = int(time.time())
        payload = json.dumps({"ts": now, "programs": programs})
        with _mem_lock:
            _mem_cache["ts"] = now
            _mem_cache["programs"] = programs

        client = _get_redis()
        if client is not None:
            try:
                client.set(REDIS_KEY, payload, ex=REDIS_MAX_STALE)
            except Exception:
                pass

        CACHE_PATH.write_text(payload)
    except Exception:
        pass


def _read_cache():
    """Read from Redis first, then in-memory cache, then a file fallback."""
    now = int(time.time())

    # Fastest shared layer: Redis
    client = _get_redis()
    if client is not None:
        try:
            raw = client.get(REDIS_KEY)
        except Exception:
            raw = None
        if raw:
            try:
                data = json.loads(raw)
                ts = int(data.get("ts", 0))
                programs = data.get("programs", [])
                # Hydrate in-memory cache so repeated requests avoid Redis calls
                with _mem_lock:
                    _mem_cache["ts"] = ts
                    _mem_cache["programs"] = programs
                return data
            except Exception:
                pass

    # Fast path: check in-memory cache
    with _mem_lock:
        if _mem_cache["programs"] is not None and (now - _mem_cache["ts"]) <= CACHE_TTL:
            return {"ts": _mem_cache["ts"], "programs": _mem_cache["programs"]}

    # Slow path: read from file and hydrate memory cache
    try:
        if not CACHE_PATH.exists():
            return None
        raw = json.loads(CACHE_PATH.read_text())
        ts = int(raw.get("ts", 0))
        programs = raw.get("programs", [])
        # Hydrate in-memory cache if file is still fresh
        if (now - ts) <= CACHE_TTL:
            with _mem_lock:
                _mem_cache["ts"] = ts
                _mem_cache["programs"] = programs
        return raw
    except Exception:
        return None


SHEET_KEY = "1hl1S5QGgy2DLf8M1YgldsqUEC-u1hg54K8mD5mZoWw8"
SHEET_TAB = "Current"
COLS = ["A", "B", "I"]  # name, code, business_days

_spreadsheet_lock = threading.Lock()
_spreadsheet_cache = {"creds": None, "spreadsheet": None}


def _get_spreadsheet():
    # Reuse the authenticated client so we don't re-do OAuth + metadata
    # round-trips on every fetch.
    creds_json = os.environ["GOOGLE_CREDENTIALS"]
    with _spreadsheet_lock:
        if _spreadsheet_cache["spreadsheet"] is not None and _spreadsheet_cache["creds"] == creds_json:
            return _spreadsheet_cache["spreadsheet"]

        creds = ServiceAccountCredentials.from_json_keyfile_dict(json.loads(creds_json), scope)
        spreadsheet = gspread.authorize(creds).open_by_key(SHEET_KEY)
        _spreadsheet_cache["creds"] = creds_json
        _spreadsheet_cache["spreadsheet"] = spreadsheet
        return spreadsheet


def _fetch_sheet():
    # Fetch fresh sheet data (may be slow due to network)
    spreadsheet = _get_spreadsheet()

    # Pull only the columns we need (name, code, business days) in a single
    # batched request instead of downloading all nine columns.
    resp = spreadsheet.values_batch_get([f"{SHEET_TAB}!{c}:{c}" for c in COLS])
    columns = {}
    for vr in resp.get("valueRanges", []):
        cell = vr["range"].split("!")[-1].split(":")[0]  # e.g. "A1" -> "A"
        columns[cell.rstrip("0123456789")] = vr.get("values", [])

    names = columns.get("A", [])
    codes = columns.get("B", [])
    days = columns.get("I", [])

    programs = []
    n = max(len(names), len(codes), len(days))
    for i in range(1, n):  # skip header row
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
            # skip malformed rows
            continue

    return try_process_with_gpu(programs)


def _background_refresh():
    try:
        programs = _fetch_sheet()
        _write_cache(programs)
    except Exception:
        # ignore background failures
        pass


def get_sheet_data():
    """
    Return programs quickly using a local cache. If cache is missing we fetch
    synchronously. If cache exists but is stale we return cached data and start
    a background refresh so subsequent requests are fast.
    """
    # Try cache first
    raw = _read_cache()
    now = int(time.time())

    if raw:
        ts = int(raw.get("ts", 0))
        programs = raw.get("programs", [])

        # If cache is fresh, return it
        if now - ts <= CACHE_TTL:
            return programs

        # Cache is stale: return cached data immediately and refresh in background
        thread = threading.Thread(target=_background_refresh, daemon=True)
        thread.start()
        return programs

    # No cache: fetch synchronously and write cache
    programs = _fetch_sheet()
    _write_cache(programs)
    return programs


def prewarm_cache():
    """
    Pre-fetch Google Sheets data on server startup so the first API request
    is served from cache instantly instead of blocking on network I/O.
    Safe to call multiple times -- only fetches if cache is empty or stale.
    """
    try:
        raw = _read_cache()
        now = int(time.time())
        if raw and (now - int(raw.get("ts", 0))) <= CACHE_TTL:
            logger.info("Cache already fresh, skipping prewarm")
            return
        logger.info("Pre-warming sheet cache...")
        programs = _fetch_sheet()
        _write_cache(programs)
        logger.info("Cache pre-warmed with %d programs", len(programs))
    except Exception as e:
        logger.warning("Cache prewarm failed: %s", e)


def try_process_with_gpu(programs):
    """
    Optional helper to demonstrate GPU-accelerated processing using Rapids cuDF.
    This does not speed up network IO; it can accelerate dataframe operations
    if the server has an NVIDIA GPU and cuDF is installed. The function will
    fall back to returning the input list if cuDF is unavailable.
    """
    try:
        import cudf
    except Exception:
        return programs

    try:
        df = cudf.DataFrame(programs)
        # keep the original spreadsheet order while processing on the GPU
        df = df.reset_index()
        df = df.sort_values(["index", "business_days"], ascending=[True, True])
        return df.drop(columns=["index"]).to_pandas().to_dict(orient="records")
    except Exception:
        return programs