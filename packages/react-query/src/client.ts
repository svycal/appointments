import {
  createClient as createFetchClient,
  ClientOptions,
} from '@savvycal/appointments-core';
import createQueryClient from 'openapi-react-query';

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
