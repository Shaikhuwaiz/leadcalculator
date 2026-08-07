const CHICAGO_TZ = "America/Chicago";
const IST_TZ = "Asia/Kolkata";

// App-generated legacy stamps: "8/6/2026, 3:13 PM" (M/D/YYYY, Chicago wall time)
const LEGACY_CHICAGO = /^(\d{1,2})\/(\d{1,2})\/(\d{4}),\s+(\d{1,2}):(\d{2})\s+([AP]M)$/;

// Seed update stamps: "03-08-2026 , Mon 10:26 PM" (DD-MM-YYYY, already IST wall time)
const LEGACY_IST = /^(\d{1,2})-(\d{1,2})-(\d{4})\s*,\s*[A-Za-z]{3}\s+(\d{1,2}):(\d{2})\s+([AP]M)$/;

const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

/**
 * Convert a wall-clock time to UTC milliseconds, resolving DST by probing the
 * possible UTC offsets for the timezone until the wall time matches.
 */
function wallTimeToUtcMs({ year, month, day, hour, minute }, tz) {
  // Signed UTC offsets (UTC = wall time - offset). Chicago: -5 (CDT) / -6 (CST). IST: +5:30.
  const offsets = tz === CHICAGO_TZ ? [-5, -6] : [5.5];

  for (const offset of offsets) {
    const whole = Math.floor(offset);
    const frac = Math.round((offset - whole) * 60);
    const utcMs = Date.UTC(year, month - 1, day, hour - whole, minute - frac);

    const parts = {};
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
      .formatToParts(utcMs)
      .forEach(({ type, value }) => {
        parts[type] = value;
      });

    if (
      Number(parts.year) === year &&
      Number(parts.month) === month &&
      Number(parts.day) === day &&
      Number(parts.hour) === hour &&
      Number(parts.minute) === minute
    ) {
      return utcMs;
    }
  }

  return null;
}

function parseAmPm(hour, ampm) {
  let h = Number(hour) % 12;
  if (ampm === "PM") h += 12;
  return h;
}

/**
 * Normalize any stored update date to a UTC ISO string so downstream code can
 * format it consistently in Indian time.
 */
export function normalizeUpdateDateToUtcIso(dateStr) {
  const s = String(dateStr || "").trim();
  if (!s) return s;

  let match;

  if ((match = s.match(LEGACY_CHICAGO))) {
    const [, month, day, year, hour, minute, ampm] = match;
    const ms = wallTimeToUtcMs(
      {
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: parseAmPm(hour, ampm),
        minute: Number(minute),
      },
      CHICAGO_TZ
    );
    return ms == null ? s : new Date(ms).toISOString();
  }

  if ((match = s.match(LEGACY_IST))) {
    const [, day, month, year, hour, minute, ampm] = match;
    const ms = wallTimeToUtcMs(
      {
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: parseAmPm(hour, ampm),
        minute: Number(minute),
      },
      IST_TZ
    );
    return ms == null ? s : new Date(ms).toISOString();
  }

  if (ISO_RE.test(s)) {
    const t = new Date(s).getTime();
    return Number.isNaN(t) ? s : new Date(t).toISOString();
  }

  return s;
}

/** Format a stored update date in Indian time (IST). */
export function formatISTDate(dateStr) {
  const normalized = normalizeUpdateDateToUtcIso(dateStr);
  const t = new Date(normalized).getTime();
  if (Number.isNaN(t)) return normalized || "—";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: IST_TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(t);
}

/**
 * Stamp a <input type="datetime-local"> value (interpreted as Indian wall time)
 * into a UTC ISO string. Falls back to "now" when the value is unparseable.
 */
export function stampUpdateDateTimeIST(datetimeLocal) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(datetimeLocal || ""));
  if (!m) return new Date().toISOString();

  const ms = wallTimeToUtcMs(
    {
      year: Number(m[1]),
      month: Number(m[2]),
      day: Number(m[3]),
      hour: Number(m[4]),
      minute: Number(m[5]),
    },
    IST_TZ
  );

  return ms == null ? new Date().toISOString() : new Date(ms).toISOString();
}

/** Current Indian wall time formatted for a datetime-local input (YYYY-MM-DDTHH:MM). */
export function getISTNowLocalInput() {
  const parts = {};
  new Intl.DateTimeFormat("en-US", {
    timeZone: IST_TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
    .formatToParts(new Date())
    .forEach(({ type, value }) => {
      parts[type] = value;
    });

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}
