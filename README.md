# SavvyCal Appointments

A monorepo containing packages for building UIs on top of the [SavvyCal Appointments API](https://developers.savvycal.app).

## Packages

| Package                                                    | Description                                                    |
| ---------------------------------------------------------- | -------------------------------------------------------------- |
| [@savvycal/appointments-core](packages/core)               | TypeScript/JavaScript client for the SavvyCal Appointments API |
| [@savvycal/appointments-react-query](packages/react-query) | React Query hooks for data fetching and mutations              |
| [@savvycal/appointments-utils](packages/utils)             | Timezone-aware date/time utilities                             |

## Development

This project uses [pnpm](https://pnpm.io/) for package management.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## License

MIT
