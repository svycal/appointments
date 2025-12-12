# @savvycal/appointments-core

TypeScript/JavaScript client library for the [SavvyCal Appointments API](https://developers.savvycal.app).

## Installation

```bash
npm install @savvycal/appointments-core
```

## Usage

### Creating a Client

```typescript
import { createFetchClient } from "@savvycal/appointments-core";

const client = createFetchClient({
  fetchAccessToken: async () => {
    // Return a JWT access token
    return "your-jwt-token";
  },
});
```

### Authentication

The client requires a `fetchAccessToken` callback that returns a JWT token. The client automatically handles token caching and refresh when tokens expire.

```typescript
const client = createFetchClient({
  fetchAccessToken: async () => {
    const response = await fetch("/api/token");
    const { token } = await response.json();
    return token;
  },
});
```

### Demo Mode

For development and testing, you can use demo mode:

```typescript
const client = createFetchClient({
  demo: "demo-token",
});
```

### Account Scoping

To scope requests to a specific account, pass the `account` option:

```typescript
const client = createFetchClient({
  account: "account-id",
  fetchAccessToken: async () => "your-jwt-token",
});
```

### Making API Calls

The client provides typed methods for all API endpoints:

```typescript
// GET request
const { data, error } = await client.GET("/v1/appointments/{appointment_id}", {
  params: {
    path: { appointment_id: "apt_123" },
  },
});

// POST request
const { data, error } = await client.POST("/v1/appointments", {
  body: {
    service_id: "svc_123",
    start_time: "2024-01-15T10:00:00Z",
    client: {
      name: "John Doe",
      email: "john@example.com",
    },
  },
});
```

### Using Operation Functions

The package also exports typed operation functions for common actions:

```typescript
import {
  createFetchClient,
  getAppointment,
  cancelAppointment,
  listServices,
} from "@savvycal/appointments-core";

const client = createFetchClient({
  fetchAccessToken: async () => "your-jwt-token",
});

// Get an appointment
const appointment = await getAppointment(client, {
  appointment_id: "apt_123",
});

// Cancel an appointment
await cancelAppointment(
  client,
  { appointment_id: "apt_123" },
  { reason: "Schedule conflict" },
);

// List services
const services = await listServices(client);
```

## Type Utilities

The package exports type utilities for extracting parameter types from API paths:

```typescript
import type {
  PathParams,
  QueryParams,
  RequestBody,
} from "@savvycal/appointments-core";

// Extract path parameters
type AppointmentPath = PathParams<"/v1/appointments/{appointment_id}", "get">;
// => { appointment_id: string }

// Extract query parameters
type SlotsQuery = QueryParams<"/v1/public/services/{service_id}/slots", "get">;
// => { from: string; until: string; time_zone?: string; ... }

// Extract request body type
type CreateAppointmentBody = RequestBody<"/v1/appointments", "post">;
// => { service_id: string; start_time: string; client: { ... }; ... }
```

## API Reference

See the [SavvyCal Appointments API documentation](https://developers.savvycal.app) for full API details.

## License

MIT
