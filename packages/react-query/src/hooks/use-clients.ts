import type { Client } from '../client';
import { paths } from '@savvycal/appointments-core';

type ClientsParams =
  paths['/v1/clients']['get']['parameters'];

export const useClients = (
  client: Client,
  params?: ClientsParams['query'],
  options?: any,
) => {
  return client.useQuery('get', '/v1/clients', {
    params: {
      query: params,
    },
  }, options);
};
