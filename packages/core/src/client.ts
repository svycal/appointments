import createClient, { ClientOptions } from "openapi-fetch";

import type { paths } from "./schema";

export type { paths };
export * from "./schema-types";

const DEFAULT_BASE_URL = "https://api.savvycal.app";

export type FetchClientOptions = {
  /**
   * ID for the SavvyCal account.
   * Used to scope requests to a specific account via the `X-SavvyCal-Account` header.
   */
  account?: string;

  /**
   * Base URL for the SavvyCal API.
   * Defaults to 'https://api.savvycal.app'
   */
  baseUrl?: string;
} & (
  | { apiKey?: never; demoAlias?: string }
  | { apiKey?: string; demoAlias?: never }
) &
  Omit<ClientOptions, "baseUrl">;

/**
 * Creates a fetch client for the SavvyCal Appointments API.
 *
 * @param options - Configuration options for the client
 * @returns A configured API client.
 */
export const createFetchClient = (options: FetchClientOptions = {}) => {
  const clientOptions = {
    baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
    headers: {},
    ...options,
  };

  if (options.apiKey) {
    clientOptions.headers = {
      ...clientOptions.headers,
      Authorization: `Bearer ${options.apiKey}`,
    };
  }

  if (options.demoAlias) {
    clientOptions.headers = {
      ...clientOptions.headers,
      Authorization: `Demo ${options.demoAlias}`,
    };
  }

  if (options.account) {
    clientOptions.headers = {
      ...clientOptions.headers,
      "X-SavvyCal-Account": options.account,
    };
  }

  return createClient<paths>(clientOptions);
};

export type FetchClient = ReturnType<typeof createFetchClient>;
