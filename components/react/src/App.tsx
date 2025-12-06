import { SavvyCalProvider } from "@savvycal/appointments-react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { PublicBookingForm } from "./components/public-booking-form";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SavvyCalProvider baseUrl="http://localhost:4002" demoAlias="docs">
          <PublicBookingForm serviceId="srv_28f3a4bd5986" />
          <ReactQueryDevtools />
        </SavvyCalProvider>
      </QueryClientProvider>
    </>
  );
};

export default App;
