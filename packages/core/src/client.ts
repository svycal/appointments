import type {
  HttpMethod,
  OperationRequestBodyContent,
} from "openapi-typescript-helpers";

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

/**
 * Extract the path parameters type for a given path and HTTP method.
 *
 * @example
 * ```typescript
 * type EarliestSlotPath = PathParams<"/v1/public/services/{service_id}/earliest_slot", "get">;
 * // => { service_id: string }
 * ```
 */
export type PathParams<
  Path extends keyof paths,
  Method extends HttpMethod,
> = Method extends keyof paths[Path]
  ? paths[Path][Method] extends { parameters: infer P }
    ? P extends { path?: infer PathType }
      ? PathType
      : never
    : never
  : never;

/**
 * Extract the query parameters type for a given path and HTTP method.
 *
 * @example
 * ```typescript
 * type SlotsQuery = QueryParams<"/v1/public/services/{service_id}/slots", "get">;
 * // => { from: string; until: string; time_zone?: string; ... }
 * ```
 */
export type QueryParams<
  Path extends keyof paths,
  Method extends HttpMethod,
> = Method extends keyof paths[Path]
  ? paths[Path][Method] extends { parameters: infer P }
    ? P extends { query?: infer Q }
      ? Q
      : never
    : never
  : never;

/**
 * Extract the request body type for a given path and HTTP method.
 * Returns the JSON body type that the client expects.
 *
 * @example
 * ```typescript
 * type CreateAppointmentBody = RequestBody<"/v1/appointments", "post">;
 * // => { service_id: string; start_time: string; ... }
 * ```
 */
export type RequestBody<
  Path extends keyof paths,
  Method extends HttpMethod,
> = Method extends keyof paths[Path]
  ? OperationRequestBodyContent<paths[Path][Method]>
  : never;
