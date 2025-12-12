# @savvycal/appointments-utils

Timezone-aware date/time utilities for the SavvyCal Appointments components, built on the TC39 Temporal API.

## Installation

```bash
npm install @savvycal/appointments-utils
```

## API Reference

### `startOfMonth(date)`

Gets the first day of the month for a given date.

```typescript
import { startOfMonth } from "@savvycal/appointments-utils";

startOfMonth(new Date("2025-12-15"));
// Date object representing 2025-12-01
```

### `endOfMonth(date)`

Gets the last day of the month for a given date.

```typescript
import { endOfMonth } from "@savvycal/appointments-utils";

endOfMonth(new Date("2025-12-15"));
// Date object representing 2025-12-31
```

### `toISODate(date)`

Converts a date to an ISO date string (YYYY-MM-DD).

```typescript
import { toISODate } from "@savvycal/appointments-utils";

toISODate(new Date("2025-12-04T14:30:00Z"));
// "2025-12-04"

toISODate(1733324400000); // Unix timestamp in milliseconds
// "2025-12-04"

toISODate("2025-12-04T14:30:00Z");
// "2025-12-04"
```

### `toISONaiveDateTime(date, timeZone)`

Converts a date to a naive datetime string (without timezone info) in the specified timezone.

```typescript
import { toISONaiveDateTime } from "@savvycal/appointments-utils";

toISONaiveDateTime(new Date("2025-12-04T19:22:00Z"), "America/New_York");
// "2025-12-04T14:22:00"
```

### `formatDate(date, options)`

Formats a date for display using `Intl.DateTimeFormat`.

```typescript
import { formatDate } from "@savvycal/appointments-utils";

formatDate(new Date(), { day: "numeric", month: "long", weekday: "long" });
// "Thursday, December 4"

formatDate(new Date(), { month: "short", year: "numeric" });
// "Dec 2025"
```

### `fromUnixTime(timestamp)`

Converts a Unix timestamp (in seconds) to a Date object.

```typescript
import { fromUnixTime } from "@savvycal/appointments-utils";

fromUnixTime(1733324400);
// Date object representing 2025-12-04T14:00:00Z
```

### `getBrowserTimeZone()`

Gets the browser's current timezone.

```typescript
import { getBrowserTimeZone } from "@savvycal/appointments-utils";

getBrowserTimeZone();
// "America/New_York"
```

### `getTimeZoneDisplayName(timeZone)`

Gets a human-readable display name for a timezone.

```typescript
import { getTimeZoneDisplayName } from "@savvycal/appointments-utils";

getTimeZoneDisplayName("America/New_York");
// "Eastern Standard Time"

getTimeZoneDisplayName("Europe/London");
// "Greenwich Mean Time"
```

### `isSameDay(date1, date2, timeZone)`

Checks if two dates fall on the same calendar day in the specified timezone.

```typescript
import { isSameDay } from "@savvycal/appointments-utils";

// These are the same day in Eastern time (both Dec 4)
isSameDay(
  new Date("2025-12-04T23:00:00Z"),
  new Date("2025-12-05T01:00:00Z"),
  "America/New_York",
);
// true

// But different days in UTC
isSameDay(
  new Date("2025-12-04T23:00:00Z"),
  new Date("2025-12-05T01:00:00Z"),
  "UTC",
);
// false
```

## License

MIT
