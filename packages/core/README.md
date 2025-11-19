# @savvycal/appointments-core

Core JavaScript/TypeScript client library for the SavvyCal Appointments API.

## Installation

```bash
npm install @savvycal/appointments-core
# or
pnpm add @savvycal/appointments-core
# or
yarn add @savvycal/appointments-core
```

## Usage

This package provides a fully-typed TypeScript client for the SavvyCal Appointments API.

```typescript
import { client } from '@savvycal/appointments-core';

// Configure the client
client.setConfig({
  baseUrl: 'https://api.savvycal.app/v1',
  headers: {
    Authorization: 'Bearer YOUR_API_TOKEN'
  }
});

// Use the client
// ... (add usage examples based on your API)
```

## Development

### Generate API Client

This package uses [@hey-api/openapi-ts](https://github.com/hey-api/openapi-ts) to generate the TypeScript client from the OpenAPI specification.

```bash
pnpm openapi-ts
```

### Build

```bash
pnpm build
```

### Watch Mode

```bash
pnpm dev
```

## License

MIT
