import { Head, usePage } from '@inertiajs/react';
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient();

export const RootLayout = ({ children }: { children: ReactNode }) => {
  const page = usePage<{
    pageTitle: string;
  }>();

  return (
    <>
      <Head>
        <title>{page.props.pageTitle}</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
};
