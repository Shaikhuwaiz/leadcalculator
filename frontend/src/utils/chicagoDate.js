const CHICAGO_TZ = "America/Chicago";

export function toChicagoYMD(date = new Date()) {
  const parts = {};
  new Intl.DateTimeFormat("en-US", {
    timeZone: CHICAGO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(date)
    .forEach(({ type, value }) => {
      parts[type] = value;
    });
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getChicagoHour(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CHICAGO_TZ,
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);
  return Number(parts.find((p) => p.type === "hour").value);
}

export function getChicagoWeekday(ymd) {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function addCalendarDays(ymd, days) {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isBusinessDay(ymd, holidays) {
  const weekday = getChicagoWeekday(ymd);
  if (weekday === 0 || weekday === 6) return false;
  return !holidays.includes(ymd);
}

export function nextBusinessDay(ymd, holidays) {
  let cursor = addCalendarDays(ymd, 1);
  while (!isBusinessDay(cursor, holidays)) {
    cursor = addCalendarDays(cursor, 1);
  }
  return cursor;
}

export function addBusinessDaysFromYMD(startYmd, days, holidays) {
  let cursor = startYmd;
  let added = 0;

  while (added < days) {
    cursor = addCalendarDays(cursor, 1);
    if (isBusinessDay(cursor, holidays)) {
      added += 1;
    }
  }

  return cursor;
}

export function formatChicagoDate(ymd) {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return date.toLocaleDateString("en-US", {
    timeZone: CHICAGO_TZ,
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function getChicagoHourFromIso(isoString) {
  if (!isoString) return getChicagoHour();
  return getChicagoHour(new Date(isoString));
}
