import {
  createClient as createFetchClient,
  ClientOptions,
  paths,
} from "@savvycal/appointments-core";
import createQueryClient from "openapi-react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { MaybeOptionalInit, FetchResponse } from "openapi-fetch";
import type {
  HttpMethod,
  PathsWithMethod,
  MediaType,
} from "openapi-typescript-helpers";

/**
 * Creates a client with TanStack Query helpers for the SavvyCal Appointments API.
 *
 * @param options - Configuration options for the client (optional)
 * @returns A configured API client with TanStack Query helpers
 */
export const createClient = (options?: ClientOptions) => {
  return createQueryClient(createFetchClient(options));
};

export type Client = ReturnType<typeof createClient>;

/**
 * Helper type to extract the mutation options for a specific endpoint.
 * This type reconstructs the exact shape of the options argument that client.useMutation expects
 * for a given HTTP method and path combination, matching the implementation from openapi-react-query.
 *
 * @example
 * ```typescript
 * type CreateAppointmentOptions = MutationOptionsFor<"post", "/v1/public/appointments">;
 *
 * interface Options extends CreateAppointmentOptions {
 *   client?: Client;
 * }
 * ```
 */
export type MutationOptionsFor<
  Method extends HttpMethod,
  Path extends PathsWithMethod<paths, Method>,
  Media extends MediaType = MediaType,
> = Omit<
  UseMutationOptions<
    GetResponseData<Path, Method, Media>,
    GetResponseError<Path, Method, Media>,
    MaybeOptionalInit<paths[Path], Method>
  >,
  "mutationKey" | "mutationFn"
>;

// Helper type to safely extract response data
type GetResponseData<
  Path extends keyof paths,
  Method extends HttpMethod,
  Media extends MediaType,
> = Path extends keyof paths
  ? Method extends keyof paths[Path]
    ? paths[Path][Method] extends infer Operation
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Operation extends Record<string, any>
        ? Required<
            FetchResponse<
              Operation,
              MaybeOptionalInit<paths[Path], Method>,
              Media
            >
          >["data"]
        : never
      : never
    : never
  : never;

// Helper type to safely extract response error
type GetResponseError<
  Path extends keyof paths,
  Method extends HttpMethod,
  Media extends MediaType,
> = Path extends keyof paths
  ? Method extends keyof paths[Path]
    ? paths[Path][Method] extends infer Operation
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Operation extends Record<string, any>
        ? Required<
            FetchResponse<
              Operation,
              MaybeOptionalInit<paths[Path], Method>,
              Media
            >
          >["error"]
        : never
      : never
    : never
  : never;

/**
 * Helper type to extract the query options for a specific endpoint.
 * This type reconstructs the exact shape of the options argument that client.useQuery expects
 * for a given HTTP method and path combination.
 *
 * @example
 * ```typescript
 * type GetAppointmentOptions = QueryOptionsFor<"get", "/v1/appointments/{appointment_id}">;
 *
 * interface Options extends GetAppointmentOptions {
 *   client?: Client;
 * }
 * ```
 */
export type QueryOptionsFor<
  Method extends HttpMethod,
  Path extends PathsWithMethod<paths, Method>,
  Media extends MediaType = MediaType,
> = Omit<
  UseQueryOptions<
    GetResponseData<Path, Method, Media>,
    GetResponseError<Path, Method, Media>,
    GetResponseData<Path, Method, Media>,
    QueryKey<Path, Method>
  >,
  "queryKey" | "queryFn"
>;

// Helper type for query keys
type QueryKey<
  Path extends keyof paths,
  Method extends HttpMethod,
  Init = MaybeOptionalInit<paths[Path], Method>,
> = Init extends undefined
  ? readonly [Method, Path]
  : readonly [Method, Path, Init];
