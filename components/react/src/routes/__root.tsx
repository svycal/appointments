import type { ReactNode } from "react";

import { SavvyCalProvider } from "@savvycal/appointments-react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { useFrameResizing } from "../hooks/use-frame-resizing";

const queryClient = new QueryClient();

// Report the height of the frame to the parent
function FrameResizer({ children }: { children: ReactNode }) {
  const { containerRef } = useFrameResizing();
  return <div ref={containerRef}>{children}</div>;
}

const RootLayout = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SavvyCalProvider demo="docs">
          <FrameResizer>
            <Outlet />
          </FrameResizer>
          <ReactQueryDevtools />
        </SavvyCalProvider>
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
