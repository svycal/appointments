import { Temporal } from "temporal-polyfill";

/**
 * Gets the last day of the month for a given date.
 *
 * @param date - The date to get the end of month for.
 * @returns A Date object set to the last day of the month.
 *
 * @example
 * ```ts
 * endOfMonth(new Date("2025-12-15"));
 * // Date object representing 2025-12-31
 * ```
 */
export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Formats a date for display using Intl.DateTimeFormat.
 *
 * @param date - The date to format.
 * @param options - Intl.DateTimeFormat options.
 * @returns The formatted date string.
 *
 * @example
 * ```ts
 * formatDate(new Date(), { day: "numeric", month: "long", weekday: "long" });
 * // "Thursday, December 4"
 * ```
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

/**
 * Converts a Unix timestamp (seconds) to a Date object.
 *
 * @param timestamp - The Unix timestamp in seconds.
 * @returns A JavaScript Date object.
 *
 * @example
 * ```ts
 * fromUnixTime(1733324400);
 * // Date object representing 2025-12-04T14:00:00Z
 * ```
 */
export function fromUnixTime(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

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
 * Gets a human-readable display name for a timezone.
 *
 * @param timeZone - The IANA timezone identifier.
 * @returns The display name of the timezone (e.g., "Eastern Standard Time").
 *
 * @example
 * ```ts
 * getTimeZoneDisplayName("America/New_York");
 * // "Eastern Standard Time"
 * ```
 */
export function getTimeZoneDisplayName(timeZone: string): string {
  const parts = new Intl.DateTimeFormat(undefined, {
    timeZone,
    timeZoneName: "long",
  }).formatToParts(new Date());
  return parts.find((p) => p.type === "timeZoneName")?.value ?? timeZone;
}

/**
 * Checks if two dates are on the same day in a given timezone.
 *
 * @param date1 - The first date to compare.
 * @param date2 - The second date to compare.
 * @param timeZone - The timezone to use for comparison.
 * @returns True if both dates fall on the same calendar day in the specified timezone.
 *
 * @example
 * ```ts
 * isSameDay(new Date("2025-12-04T23:00:00Z"), new Date("2025-12-05T01:00:00Z"), "America/New_York");
 * // true (both are Dec 4 in Eastern time)
 * ```
 */
export function isSameDay(date1: Date, date2: Date, timeZone: string): boolean {
  const instant1 = Temporal.Instant.fromEpochMilliseconds(date1.getTime());
  const instant2 = Temporal.Instant.fromEpochMilliseconds(date2.getTime());
  const plain1 = instant1.toZonedDateTimeISO(timeZone).toPlainDate();
  const plain2 = instant2.toZonedDateTimeISO(timeZone).toPlainDate();
  return Temporal.PlainDate.compare(plain1, plain2) === 0;
}

/**
 * Gets the first day of the month for a given date.
 *
 * @param date - The date to get the start of month for.
 * @returns A Date object set to the first day of the month.
 *
 * @example
 * ```ts
 * startOfMonth(new Date("2025-12-15"));
 * // Date object representing 2025-12-01
 * ```
 */
export function startOfMonth(date: Date | string): Date {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Date(d.getFullYear(), d.getMonth(), 1);
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
export function toISODate(date: Date | number | string): string {
  if (date instanceof Date) {
    return Temporal.PlainDate.from(date.toISOString().split("T")[0]).toString();
  } else if (typeof date === "number") {
    const instant = Temporal.Instant.fromEpochMilliseconds(date);
    return instant.toZonedDateTimeISO("UTC").toPlainDate().toString();
  } else {
    return Temporal.PlainDate.from(date.split("T")[0]).toString();
  }
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
): string {
  let instant: Temporal.Instant;

  if (date instanceof Date) {
    instant = Temporal.Instant.fromEpochMilliseconds(date.getTime());
  } else if (typeof date === "number") {
    instant = Temporal.Instant.fromEpochMilliseconds(date);
  } else {
    instant = Temporal.Instant.from(date);
  }

  const zonedDateTime = instant.toZonedDateTimeISO(timeZone);
  return zonedDateTime.toPlainDateTime().toString({ smallestUnit: "second" });
}
