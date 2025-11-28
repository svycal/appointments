import { Head, usePage } from "@inertiajs/react";
import React, { ReactNode, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createClient,
  SavvyCalProvider,
} from "@savvycal/appointments-react-query";

export const RootLayout = ({ children }: { children: ReactNode }) => {
  const page = usePage<{
    pageTitle: string;
    savvycalToken: string;
  }>();

  const [queryClient] = useState(() => new QueryClient());

  const client = useMemo(
    () =>
      createClient({
        apiKey: page.props.savvycalToken,
        baseUrl: "http://localhost:4002",
      }),
    [page.props.savvycalToken],
  );

  return (
    <>
      <Head>
        <title>{page.props.pageTitle}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <SavvyCalProvider client={client}>
          {children}
          <ReactQueryDevtools />
        </SavvyCalProvider>
      </QueryClientProvider>
    </>
  );
};
