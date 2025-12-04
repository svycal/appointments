import React, { createContext, ReactNode, useContext } from "react";

import { Client } from "./client";

const SavvyCalContext = createContext<Client | undefined>(undefined);
SavvyCalContext.displayName = "SavvyCalContext";

export interface SavvyCalProviderProps {
  children: ReactNode;
  client: Client;
}

/**
 * Provider component to make the SavvyCal client available to its children.
 * @param children - The child components that will have access to the client.
 * @param client - The SavvyCal client instance.
 */
export const SavvyCalProvider = ({
  children,
  client,
}: SavvyCalProviderProps) => {
  return (
    <SavvyCalContext.Provider value={client}>
      {children}
    </SavvyCalContext.Provider>
  );
};

SavvyCalProvider.displayName = "SavvyCalProvider";

/**
 * Hook to access the SavvyCal client instance.
 * @param overrideClient - Optional client to use instead of the one from context.
 * @returns The SavvyCal client instance.
 * @throws Error if used outside of a `SavvyCalProvider` and no override client is provided.
 */
export const useSavvyCalClient = (overrideClient?: Client) => {
  const context = useContext(SavvyCalContext);

  if (context === undefined && !overrideClient) {
    throw new Error("useSavvyCalClient must be used within a SavvyCalProvider");
  }

  return overrideClient || context!;
};
