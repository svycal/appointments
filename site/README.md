# SavvyCal Appointments Docs

This website is built using [Docusaurus](https://docusaurus.io/).

### Installation

```
$ pnpm install
```

### Local Development

```
$ pnpm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Regenerating API docs

```
$ pnpm run regen-api-docs
```

This command cleans up old API docs and regenerates them by querying the Open API spec (from the production API server).

### Build

```
$ pnpm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

The site will deploy to GitHub Pages automatically when changes are pushed to the `main` branch.
