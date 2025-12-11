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

Before using the components, you'll need to prepare your frontend for data fetching.

### Install dependencies

Add the following dependencies to your project:

```bash
npm install @tanstack/react-query @savvycal/appointments-react-query
```

### Set up your app root

Ensure the `<QueryClientProvider>` and `<SavvyCalProvider>` components are present in your app's root component.

```tsx
import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SavvyCalProvider } from "@savvycal/appointments-react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  // State to store any errors that occur
  const [tokenError, setTokenError] = useState<string | null>(null);

  const fetchAccessToken = useMemo(async () => {
    // Fetch an access token from your backend for the SavvyCal account
    const response = await fetch("/access_token");

    if (!response.ok) {
      const { error } = await response.json();
      console.error("An error occurred: ", error);
      setTokenError(error);
      return undefined;
    } else {
      const { accessToken } = await response.json();
      return accessToken;
    }
  }, [setTokenError]);

  return (
    <QueryClientProvider client={queryClient}>
      <SavvyCalProvider fetchAccessToken={fetchAccessToken}>
        {/* ... */}
      </SavvyCalProvider>
    </QueryClientProvider>
  );
}
```
