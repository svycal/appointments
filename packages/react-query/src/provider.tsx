import {
  createFetchClient,
  type FetchClient,
  type FetchClientOptions,
} from "@savvycal/appointments-core";
import React, { createContext, ReactNode, useContext, useMemo } from "react";

import { createQueryClient, type QueryClient } from "./client";

interface SavvyCalContextData {
  fetchClient: FetchClient;
  queryClient: QueryClient;
}

const SavvyCalContext = createContext<SavvyCalContextData | undefined>(
  undefined,
);
SavvyCalContext.displayName = "SavvyCalContext";

export interface SavvyCalProviderProps extends FetchClientOptions {
  children: ReactNode;
}

/**
 * Provider component to make the SavvyCal client available to its children.
 */
export const SavvyCalProvider = ({
  children,
  ...clientOptions
}: SavvyCalProviderProps) => {
  const fetchClient = useMemo(
    () => createFetchClient(clientOptions),
    [clientOptions],
  );

  const queryClient = useMemo(
    () => createQueryClient(fetchClient),
    [fetchClient],
  );

  return (
    <SavvyCalContext.Provider value={{ fetchClient, queryClient }}>
      {children}
    </SavvyCalContext.Provider>
  );
};

SavvyCalProvider.displayName = "SavvyCalProvider";

/**
 * Hook to access the SavvyCal query client instance.
 * @param overrideClient - Optional client to use instead of the one from context.
 * @returns The SavvyCal query client instance.
 * @throws Error if used outside of a `SavvyCalProvider` and no override client is provided.
 */
export const useSavvyCalQueryClient = (overrideClient?: QueryClient) => {
  const context = useContext(SavvyCalContext);

  if (context === undefined && !overrideClient) {
    throw new Error(
      "useSavvyCalQueryClient must be used within a SavvyCalProvider",
    );
  }

  return overrideClient || context!.queryClient;
};

/**
 * Hook to access the SavvyCal fetch client instance.
 * @param overrideClient - Optional client to use instead of the one from context.
 * @returns The SavvyCal fetch client instance.
 * @throws Error if used outside of a `SavvyCalProvider` and no override client is provided.
 */
export const useSavvyCalFetchClient = (overrideClient?: FetchClient) => {
  const context = useContext(SavvyCalContext);

  if (context === undefined && !overrideClient) {
    throw new Error(
      "useSavvyCalFetchClient must be used within a SavvyCalProvider",
    );
  }

  return overrideClient || context!.fetchClient;
};
