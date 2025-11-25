import { Head, usePage } from '@inertiajs/react';
import React, { ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createClient } from '@savvycal/appointments-react-query';
import { SavvyCalContext } from '../contexts';

// Create a client
const queryClient = new QueryClient();

export const RootLayout = ({ children }: { children: ReactNode }) => {
  const page = usePage<{
    pageTitle: string;
  }>();

  const client = useMemo(() => createClient({}), []);

  return (
    <>
      <Head>
        <title>{page.props.pageTitle}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <SavvyCalContext value={client}>
          {children}
          <ReactQueryDevtools />
        </SavvyCalContext>
      </QueryClientProvider>
    </>
  );
};
