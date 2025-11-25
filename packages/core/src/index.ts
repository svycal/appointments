import createFetchClient, { ClientOptions } from 'openapi-fetch';
import type { paths } from './schema';

export type { paths };

/**
 * Creates a client for the SavvyCal Appointments API.
 */
export const createClient = (options: ClientOptions) => {
  return createFetchClient<paths>({
    baseUrl: 'https://api.savvycal.app',
    ...options,
  });
};
