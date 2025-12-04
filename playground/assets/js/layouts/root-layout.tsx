import { Head, usePage } from "@inertiajs/react";
import { SavvyCalProvider } from "@savvycal/appointments-react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { ReactNode, useState } from "react";

export const RootLayout = ({ children }: { children: ReactNode }) => {
  const page = usePage<{
    pageTitle: string;
    savvycalToken: string;
  }>();

  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Head>
        <title>{page.props.pageTitle}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <SavvyCalProvider
          apiKey={page.props.savvycalToken}
          baseUrl="http://localhost:4002"
        >
          {children}
          <ReactQueryDevtools />
        </SavvyCalProvider>
      </QueryClientProvider>
    </>
  );
};
