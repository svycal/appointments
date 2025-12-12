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

## Releasing

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

### Adding a changeset

When you make changes that should be released, run:

```bash
pnpm changeset
```

This will prompt you to:
1. Select the packages that have changed
2. Choose the bump type (major, minor, patch)
3. Write a summary of the changes

Commit the generated changeset file along with your changes.

### Publishing releases

Releases are automated via GitHub Actions:

1. When PRs with changesets are merged to `main`, the action creates/updates a "Version Packages" PR
2. This PR bumps versions and updates changelogs based on the changesets
3. Merging the "Version Packages" PR triggers the publish to npm

### Manual release (if needed)

```bash
pnpm version   # Bump versions and update changelogs
pnpm release   # Build and publish to npm
```

## License

MIT
