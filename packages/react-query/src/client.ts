import { ClientOptions } from 'openapi-fetch';
import { createClient as createFetchClient } from '@savvycal/appointments-core';
import createQueryClient from 'openapi-react-query';

/**
 * Creates a client with TanStack Query helpers for the SavvyCal Appointments API.
 */
export const createClient = (options: ClientOptions) => {
  return createQueryClient(createFetchClient(options));
};

export type Client = ReturnType<typeof createClient>;
