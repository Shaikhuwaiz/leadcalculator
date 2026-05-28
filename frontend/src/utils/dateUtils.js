import {
  getChicagoHour,
  isBusinessDay,
  nextBusinessDay,
  toChicagoYMD,
} from "./chicagoDate";

/** Today's calendar date in Missouri (CDT/CST) — always shown in the UI. */
export function getTodayChicagoYMD() {
  return toChicagoYMD();
}

/**
 * Start date for leadtime math. After 2 PM Missouri, the client counts from
 * the next business day (shipping cutoff rule). Weekends/holidays roll forward too.
 */
export function getLeadtimeStartYMD(holidays = []) {
  let startYmd = toChicagoYMD();

  if (getChicagoHour() >= 14) {
    startYmd = nextBusinessDay(startYmd, holidays);
  } else if (!isBusinessDay(startYmd, holidays)) {
    startYmd = nextBusinessDay(startYmd, holidays);
  }

  return startYmd;
}

/** @deprecated Use getLeadtimeStartYMD for calculations. */
export function getBaseDateYMD(holidays = []) {
  return getLeadtimeStartYMD(holidays);
}

/** @deprecated Prefer getTodayChicagoYMD / getLeadtimeStartYMD. */
export function getBaseDate(holidays = []) {
  const ymd = getLeadtimeStartYMD(holidays);
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, month - 1, day);
}
