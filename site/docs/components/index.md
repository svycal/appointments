---
---

# Components

SavvyCal Components are designed to be copied and pasted directly into your application, similar to modern UI kits like [Catalyst](https://catalyst.tailwindui.com/) and [shadcn](https://ui.shadcn.com/). This allows you to weave SavvyCal-powered functionality seamlessly into your existing UI, without resorting to messy CSS overrides to force third-party elements to look like your own.

## Prerequisites

We've build the components to require minimal external dependencies.

- **Tailwind CSS**: Components are styled with Tailwind CSS utility classes.
- **React**: Components are built with React. We may support other frameworks in the future.
- **TanStack Query**: Components use [TanStack Query](https://tanstack.com/query/docs) for data fetching.

## Preparing your app

If you haven't already, you'll need to prepare your app for data fetching.

### Install dependencies

```bash
npm install @tanstack/react-query @savvycal/appointments-react-query
```

### Add providers to your root component

Add the following code to your app's root component:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SavvyCalProvider } from "@savvycal/appointments-react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <SavvyCalProvider>{/* Your app */}</SavvyCalProvider>
    </QueryClientProvider>
  );
}
```
