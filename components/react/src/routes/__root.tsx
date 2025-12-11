import { SavvyCalProvider } from "@savvycal/appointments-react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SavvyCalProvider baseUrl="http://localhost:4002" demo="docs">
          <div className="flex gap-2 p-2">
            <Link className="[&.active]:font-bold" to="/">
              Home
            </Link>{" "}
            <Link className="[&.active]:font-bold" to="/public-booking-form">
              Public Booking Form
            </Link>
          </div>
          <hr />
          <Outlet />
          <ReactQueryDevtools />
        </SavvyCalProvider>
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
