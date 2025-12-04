import { tz } from "@date-fns/tz";
import { format, formatISO } from "date-fns";

const NAIVE_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

/**
 * Gets the browser's current time zone.
 *
 * @returns The browser's current time zone.
 *
 * @example
 * ```ts
 * getBrowserTimeZone();
 * // "America/New_York"
 * ```
 */
export function getBrowserTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Converts a date to an ISO date string.
 *
 * @param date - The date to convert.
 * @returns The ISO date string.
 *
 * @example
 * ```ts
 * toISODate(new Date());
 * // "2025-12-04"
 * ```
 */
export function toISODate(date: Date | number | string) {
  return formatISO(date, { representation: "date" });
}

/**
 * Converts a date to naive datetime string.
 *
 * @param date - The date to convert.
 * @param timeZone - The time zone to convert to.
 * @returns The naive datetime string.
 *
 * @example
 * ```ts
 * toISONaiveDateTime(new Date(), "America/New_York");
 * // "2025-12-04T14:22:00"
 * ```
 */
export function toISONaiveDateTime(
  date: Date | number | string,
  timeZone: string,
) {
  return format(date, NAIVE_DATETIME_FORMAT, {
    in: tz(timeZone),
  });
}
