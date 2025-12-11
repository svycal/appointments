import { describe, expect, it } from "vitest";

import {
  endOfMonth,
  formatDate,
  fromUnixTime,
  getBrowserTimeZone,
  getTimeZoneDisplayName,
  isSameDay,
  startOfMonth,
  toISODate,
  toISONaiveDateTime,
} from "./index";

describe("endOfMonth", () => {
  it("returns Dec 31 for a December date", () => {
    const result = endOfMonth(new Date(2025, 11, 15)); // Dec 15, 2025
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(11); // December
    expect(result.getDate()).toBe(31);
  });

  it("returns Feb 28 for non-leap year", () => {
    const result = endOfMonth(new Date(2025, 1, 10)); // Feb 10, 2025
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(28);
  });

  it("returns Feb 29 for leap year", () => {
    const result = endOfMonth(new Date(2024, 1, 10)); // Feb 10, 2024 (leap year)
    expect(result.getMonth()).toBe(1);
    expect(result.getDate()).toBe(29);
  });

  it("returns correct last day for 30-day months", () => {
    const result = endOfMonth(new Date(2025, 3, 10)); // Apr 10, 2025
    expect(result.getMonth()).toBe(3);
    expect(result.getDate()).toBe(30);
  });
});

describe("formatDate", () => {
  it("formats with day, month, and weekday options", () => {
    const date = new Date(2025, 11, 4); // Dec 4, 2025 (Thursday)
    const result = formatDate(date, {
      day: "numeric",
      month: "long",
      weekday: "long",
    });
    expect(result).toContain("Thursday");
    expect(result).toContain("December");
    expect(result).toContain("4");
  });

  it("formats with timeStyle option", () => {
    const date = new Date(2025, 11, 4, 14, 30, 0); // 2:30 PM
    const result = formatDate(date, { timeStyle: "short" });
    // Result will be locale-dependent, but should contain time
    expect(result).toMatch(/\d/);
  });
});

describe("fromUnixTime", () => {
  it("converts Unix timestamp (seconds) to Date", () => {
    // 1733324400 = 2024-12-04T14:00:00Z
    const result = fromUnixTime(1733324400);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBe(1733324400 * 1000);
  });

  it("handles zero timestamp", () => {
    const result = fromUnixTime(0);
    expect(result.getTime()).toBe(0);
  });
});

describe("getBrowserTimeZone", () => {
  it("returns a non-empty string", () => {
    const result = getBrowserTimeZone();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns a valid IANA timezone format", () => {
    const result = getBrowserTimeZone();
    // IANA timezones typically contain a slash (e.g., "America/New_York")
    // or are special like "UTC"
    expect(result).toMatch(/^[A-Za-z_]+\/[A-Za-z_]+|UTC|GMT/);
  });
});

describe("getTimeZoneDisplayName", () => {
  it("returns display name for valid timezone", () => {
    const result = getTimeZoneDisplayName("America/New_York");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    // Should contain "Eastern" or similar
    expect(result.toLowerCase()).toMatch(/eastern|new york|est|edt/i);
  });

  it("returns display name for UTC", () => {
    const result = getTimeZoneDisplayName("UTC");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("isSameDay", () => {
  it("returns true for same calendar day in timezone", () => {
    const date1 = new Date("2025-12-04T10:00:00Z");
    const date2 = new Date("2025-12-04T20:00:00Z");
    expect(isSameDay(date1, date2, "UTC")).toBe(true);
  });

  it("returns false for different calendar days", () => {
    const date1 = new Date("2025-12-04T10:00:00Z");
    const date2 = new Date("2025-12-05T10:00:00Z");
    expect(isSameDay(date1, date2, "UTC")).toBe(false);
  });

  it("handles timezone edge cases correctly", () => {
    // 2025-12-04T23:00:00Z is Dec 4 in UTC but Dec 5 in Tokyo (UTC+9)
    const date1 = new Date("2025-12-04T23:00:00Z");
    const date2 = new Date("2025-12-05T01:00:00Z");

    // In UTC: Dec 4 vs Dec 5 -> different days
    expect(isSameDay(date1, date2, "UTC")).toBe(false);

    // In Tokyo (UTC+9): Dec 5 08:00 vs Dec 5 10:00 -> same day
    expect(isSameDay(date1, date2, "Asia/Tokyo")).toBe(true);
  });

  it("handles America/New_York timezone correctly", () => {
    // 2025-12-05T04:00:00Z is Dec 4 at 11pm in New York (EST = UTC-5)
    // 2025-12-05T06:00:00Z is Dec 5 at 1am in New York
    const date1 = new Date("2025-12-05T04:00:00Z"); // Dec 4 11pm EST
    const date2 = new Date("2025-12-05T06:00:00Z"); // Dec 5 1am EST

    expect(isSameDay(date1, date2, "America/New_York")).toBe(false);
  });
});

describe("startOfMonth", () => {
  it("returns first of month for Date input", () => {
    const result = startOfMonth(new Date(2025, 11, 15)); // Dec 15, 2025
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(1);
  });

  it("returns first of month for string input", () => {
    const result = startOfMonth("2025-12-15");
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(1);
  });

  it("works for January", () => {
    const result = startOfMonth(new Date(2025, 0, 20)); // Jan 20, 2025
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
  });
});

describe("toISODate", () => {
  it("returns YYYY-MM-DD for Date input", () => {
    const date = new Date("2025-12-04T14:30:00Z");
    const result = toISODate(date);
    expect(result).toBe("2025-12-04");
  });

  it("returns YYYY-MM-DD for timestamp input", () => {
    // 1733324400000 ms = 2024-12-04T14:00:00Z
    const result = toISODate(1733324400000);
    expect(result).toBe("2024-12-04");
  });

  it("returns YYYY-MM-DD for ISO string input", () => {
    const result = toISODate("2025-12-04T14:30:00Z");
    expect(result).toBe("2025-12-04");
  });

  it("handles date-only string input", () => {
    const result = toISODate("2025-12-04");
    expect(result).toBe("2025-12-04");
  });
});

describe("toISONaiveDateTime", () => {
  it("returns YYYY-MM-DDTHH:mm:ss for Date in specified timezone", () => {
    // 2025-12-04T19:30:00Z in America/New_York (EST = UTC-5) is 14:30:00
    const date = new Date("2025-12-04T19:30:00Z");
    const result = toISONaiveDateTime(date, "America/New_York");
    expect(result).toBe("2025-12-04T14:30:00");
  });

  it("handles timestamp input", () => {
    // 1733337000000 ms = 2024-12-04T18:30:00Z
    // In America/New_York (EST = UTC-5) = 13:30:00
    const result = toISONaiveDateTime(1733337000000, "America/New_York");
    expect(result).toBe("2024-12-04T13:30:00");
  });

  it("handles ISO string input", () => {
    const result = toISONaiveDateTime(
      "2025-12-04T19:30:00Z",
      "America/New_York",
    );
    expect(result).toBe("2025-12-04T14:30:00");
  });

  it("handles UTC timezone", () => {
    const date = new Date("2025-12-04T14:30:00Z");
    const result = toISONaiveDateTime(date, "UTC");
    expect(result).toBe("2025-12-04T14:30:00");
  });

  it("handles timezone with positive offset", () => {
    // 2025-12-04T14:30:00Z in Asia/Tokyo (UTC+9) is 23:30:00
    const date = new Date("2025-12-04T14:30:00Z");
    const result = toISONaiveDateTime(date, "Asia/Tokyo");
    expect(result).toBe("2025-12-04T23:30:00");
  });
});
