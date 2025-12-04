import createFetchClient, {
  ClientOptions as OpenApiClientOptions,
} from "openapi-fetch";

import type { paths } from "./schema";

export type { paths };
export * from "./schema-types";

const DEFAULT_BASE_URL = "https://api.savvycal.app";

export interface ClientOptions extends Omit<OpenApiClientOptions, "baseUrl"> {
  /**
   * ID for the SavvyCal account.
   * Used to scope requests to a specific account via the `X-SavvyCal-Account` header.
   */
  account?: string;

  /**
   * API key for authentication.
   * If provided, will be used to set the Authorization header.
   */
  apiKey?: string;

  /**
   * Base URL for the SavvyCal API.
   * Defaults to 'https://api.savvycal.app'
   */
  baseUrl?: string;
}

/**
 * Creates a client for the SavvyCal Appointments API.
 *
 * @param options - Configuration options for the client
 * @returns A configured API client.
 */
export const createClient = (options: ClientOptions = {}) => {
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

  if (options.account) {
    clientOptions.headers = {
      ...clientOptions.headers,
      "X-SavvyCal-Account": options.account,
    };
  }

  return createFetchClient<paths>(clientOptions);
};
