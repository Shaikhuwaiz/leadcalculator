import {
  addBusinessDaysFromYMD,
  toChicagoYMD,
} from "../utils/chicagoDate";

/** @deprecated Use addBusinessDaysFromYMD with a YYYY-MM-DD string instead. */
export function addBusinessDays(startDate, days, holidays) {
  const startYmd = toChicagoYMD(startDate);
  const endYmd = addBusinessDaysFromYMD(startYmd, days, holidays);
  const [year, month, day] = endYmd.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export { addBusinessDaysFromYMD };
